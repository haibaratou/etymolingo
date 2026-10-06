package com.haibaratou.pictlingo.preview;

import android.content.Intent;
import android.net.Uri;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import android.os.Bundle;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@CapacitorPlugin(name = "Pictlingo")
public class PictlingoPlugin extends Plugin {
    @PluginMethod public void connectivity(PluginCall call) {
        android.net.ConnectivityManager manager=getContext().getSystemService(android.net.ConnectivityManager.class);
        android.net.NetworkCapabilities caps=manager.getNetworkCapabilities(manager.getActiveNetwork());
        JSObject result=new JSObject();
        result.put("online",caps!=null && caps.hasCapability(android.net.NetworkCapabilities.NET_CAPABILITY_INTERNET) && caps.hasCapability(android.net.NetworkCapabilities.NET_CAPABILITY_VALIDATED));
        call.resolve(result);
    }
    private TextToSpeech tts;
    private boolean ready = false;
    private boolean failed = false;
    private final List<PluginCall> waiting = new ArrayList<>();

    @Override public void load() {
        getActivity().runOnUiThread(() -> {
            tts = new TextToSpeech(getContext(), status -> getActivity().runOnUiThread(() -> {
                ready = status == TextToSpeech.SUCCESS;
                failed = !ready;
                if (ready) tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                    @Override public void onStart(String id) { event(id, "start", ""); }
                    @Override public void onDone(String id) { event(id, "done", ""); }
                    @Override public void onError(String id) { event(id, "error", "synthesis-failed"); }
                    @Override public void onError(String id, int code) { event(id, "error", "tts-" + code); }
                });
                for (PluginCall call : waiting) finishVoices(call);
                waiting.clear();
            }));
        });
    }
    private void event(String id, String state, String error) {
        JSObject data = new JSObject();
        data.put("id", id); data.put("state", state); data.put("error", error);
        notifyListeners("speechState", data);
    }
    private void finishVoices(PluginCall call) {
        JSArray voices = new JSArray();
        if (ready && tts.getVoices() != null) for (Voice voice : tts.getVoices()) {
            JSObject row = new JSObject();
            row.put("name", voice.getName()); row.put("lang", voice.getLocale().toLanguageTag());
            row.put("localService", !voice.isNetworkConnectionRequired()); voices.put(row);
        }
        JSObject result = new JSObject(); result.put("voices", voices); call.resolve(result);
    }
    @PluginMethod public void getVoices(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (ready || failed) finishVoices(call); else waiting.add(call);
        });
    }
    @PluginMethod public void speak(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (!ready) { call.reject("音声エンジンの準備ができていません"); return; }
            String text = call.getString("text", "");
            String id = call.getString("id", "");
            Locale locale = Locale.forLanguageTag(call.getString("language", "en-US"));
            if (text.isBlank() || text.length() > TextToSpeech.getMaxSpeechInputLength()) { call.reject("invalid-text"); return; }
            int status = tts.setLanguage(locale);
            if (status == TextToSpeech.LANG_MISSING_DATA || status == TextToSpeech.LANG_NOT_SUPPORTED) {
                call.reject("この言語の音声をAndroidの音声設定で追加してください"); return;
            }
            Voice selected = null;
            Set<Voice> voices = tts.getVoices();
            if (voices != null) for (Voice voice : voices) {
                if (voice.isNetworkConnectionRequired() || !voice.getLocale().getLanguage().equals(locale.getLanguage())) continue;
                if (selected == null || voice.getQuality() > selected.getQuality()) selected = voice;
            }
            if (selected != null) tts.setVoice(selected);
            float rate = Math.max(.3f, Math.min(2f, call.getFloat("rate", 1f)));
            tts.setSpeechRate(rate); tts.setPitch(1f);
            int result = tts.speak(text, TextToSpeech.QUEUE_FLUSH, new Bundle(), id);
            if (result == TextToSpeech.ERROR) call.reject("synthesis-failed"); else call.resolve();
        });
    }
    @PluginMethod public void stop(PluginCall call) {
        getActivity().runOnUiThread(() -> { if (tts != null) tts.stop(); call.resolve(); });
    }
    @PluginMethod public void exit(PluginCall call) {
        getActivity().runOnUiThread(() -> { if (tts != null) tts.stop(); call.resolve(); getActivity().finish(); });
    }
    @PluginMethod public void openExternal(PluginCall call) {
        Uri uri = Uri.parse(call.getString("url", ""));
        if (!"https".equals(uri.getScheme()) || !"haibaratou.github.io".equals(uri.getHost())) { call.reject("invalid-url"); return; }
        try { getActivity().startActivity(new Intent(Intent.ACTION_VIEW, uri)); call.resolve(); }
        catch (Exception error) { call.reject("browser-unavailable"); }
    }
    @Override protected void handleOnPause() { if (tts != null) tts.stop(); }
    @Override protected void handleOnDestroy() {
        for (PluginCall call : waiting) call.reject("app-closed"); waiting.clear();
        if (tts != null) { tts.stop(); tts.shutdown(); }
    }
}
