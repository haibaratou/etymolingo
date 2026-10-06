package com.haibaratou.pictlingo.preview;

import android.webkit.WebView;
import android.graphics.Bitmap;
import java.io.File;
import java.io.FileOutputStream;
import android.os.SystemClock;
import android.view.MotionEvent;
import android.view.InputDevice;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiSelector;
import org.json.JSONArray;
import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.Assert.*;

@RunWith(AndroidJUnit4.class)
public class OfflineGameTest {
    private MainActivity active;
    private void dismissSystemTutorial() throws Exception {
        var button=UiDevice.getInstance(InstrumentationRegistry.getInstrumentation()).findObject(new UiSelector().text("Got it"));
        if(button.waitForExists(1500))button.click();
    }
    private String js(ActivityScenario<MainActivity> scenario, String code) throws Exception {
        CountDownLatch done = new CountDownLatch(1);
        AtomicReference<String> value = new AtomicReference<>();
        if(active==null)scenario.onActivity(activity -> active=activity);
        active.runOnUiThread(() -> active.getBridge().getWebView().evaluateJavascript(code, result -> { value.set(result); done.countDown(); }));
        assertTrue("JS response timeout", done.await(10, TimeUnit.SECONDS));
        return value.get();
    }
    private void waitFor(ActivityScenario<MainActivity> scenario, String condition) throws Exception {
        long deadline = System.currentTimeMillis() + 20000;
        while (System.currentTimeMillis() < deadline) {
            if ("true".equals(js(scenario, condition))) return;
            Thread.sleep(100);
        }
        fail("Timed out: " + condition + " / " + js(scenario,"document.body.innerText"));
    }
    @Test public void offlineLaunchSwitchAndPersistentStorage() throws Exception {
        active=null;
        try (ActivityScenario<MainActivity> scenario = ActivityScenario.launch(MainActivity.class)) {
            waitFor(scenario,"!!document.getElementById('startPlay') && !document.getElementById('startPlay').disabled");
            assertEquals("true",js(scenario,"!!window.PictlingoNativeSpeech"));
            dismissSystemTutorial();
            assertEquals("true",js(scenario,"window.PICTURE_WORDS_CATALOG.length>=10"));
            js(scenario,"document.getElementById('startPlay').click()");
            waitFor(scenario,"document.getElementById('game').dataset.state==='playing' && !document.getElementById('modeToggle').disabled && document.getElementById('clueImage').complete && document.getElementById('clueImage').naturalWidth>0 && document.querySelectorAll('#letters button').length>0");
            String image=js(scenario,"document.getElementById('clueImage').src");
            String before=js(scenario,"document.getElementById('modeToggle').dataset.mode");
            js(scenario,"document.getElementById('modeToggle').click()");
            waitFor(scenario,"document.getElementById('game').dataset.state==='playing' && document.getElementById('modeToggle').dataset.mode!=="+before);
            assertEquals("Image changed on language switch",image,js(scenario,"document.getElementById('clueImage').src"));
            assertEquals("true",js(scenario,"Array.from(document.querySelectorAll('#letters button')).every(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth})"));
            Bitmap screenshot=InstrumentationRegistry.getInstrumentation().getUiAutomation().takeScreenshot();
            File destination=new File(InstrumentationRegistry.getInstrumentation().getTargetContext().getExternalFilesDir(null),"pictlingo-preview.png");
            try(FileOutputStream stream=new FileOutputStream(destination)){ screenshot.compress(Bitmap.CompressFormat.PNG,100,stream); }
            screenshot.recycle();
            js(scenario,"localStorage.setItem('android-smoke','persisted'); location.reload()");
            waitFor(scenario,"!!document.getElementById('startPlay') && !document.getElementById('startPlay').disabled");
            assertEquals("\"persisted\"",js(scenario,"localStorage.getItem('android-smoke')"));
            js(scenario,"localStorage.removeItem('android-smoke')");
        }
    }
    @Test public void fingerStrokeSolvesEnglishAndAwardsScore() throws Exception {
        active=null;
        try(ActivityScenario<MainActivity> scenario=ActivityScenario.launch(MainActivity.class)) {
            waitFor(scenario,"!!window.PictlingoNativeSpeech");
            dismissSystemTutorial();
            js(scenario,"location.href='/app/games/picture-words.html?phone=1&word=car&lang=en'");
            waitFor(scenario,"document.getElementById('game')?.dataset.state==='playing' && document.querySelectorAll('#letters button').length===3");
            JSONArray points=new JSONArray(js(scenario,"['C','A','R'].map(c=>{const b=Array.from(document.querySelectorAll('#letters button')).find(b=>b.textContent.trim()===c);const r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})"));
            double viewport=Double.parseDouble(js(scenario,"innerWidth"));
            int[] origin=new int[2];int[] width=new int[1];
            scenario.onActivity(a->{WebView web=a.getBridge().getWebView();web.getLocationOnScreen(origin);width[0]=web.getWidth();});
            float scale=(float)(width[0]/viewport);long down=SystemClock.uptimeMillis();
            for(int i=0;i<points.length();i++) {
                MotionEvent event=MotionEvent.obtain(down,SystemClock.uptimeMillis(),i==0?MotionEvent.ACTION_DOWN:MotionEvent.ACTION_MOVE,(float)points.getJSONObject(i).getDouble("x")*scale+origin[0],(float)points.getJSONObject(i).getDouble("y")*scale+origin[1],0);
                event.setSource(InputDevice.SOURCE_TOUCHSCREEN);
                assertTrue(InstrumentationRegistry.getInstrumentation().getUiAutomation().injectInputEvent(event,false));event.recycle();Thread.sleep(80);
            }
            var last=points.getJSONObject(points.length()-1);
            MotionEvent up=MotionEvent.obtain(down,SystemClock.uptimeMillis(),MotionEvent.ACTION_UP,(float)last.getDouble("x")*scale+origin[0],(float)last.getDouble("y")*scale+origin[1],0);
            up.setSource(InputDevice.SOURCE_TOUCHSCREEN);assertTrue(InstrumentationRegistry.getInstrumentation().getUiAutomation().injectInputEvent(up,false));up.recycle();
            waitFor(scenario,"document.getElementById('game').dataset.state==='solved'");
            waitFor(scenario,"document.getElementById('rewardScene').classList.contains('page-filled')");
            assertEquals("true",js(scenario,"document.getElementById('rewardSeal').textContent.includes('100')"));
            js(scenario,"document.getElementById('closeGame').click()");
        }
    }
    @Test public void allImagesBundledWithoutDownloads() throws Exception {
        active=null;
        try(ActivityScenario<MainActivity> scenario=ActivityScenario.launch(MainActivity.class)) {
            waitFor(scenario,"!!document.getElementById('startPlay') && !document.getElementById('startPlay').disabled");
            assertEquals("true",js(scenario,"PICTURE_WORDS_CATALOG.length>1000 && PICTURE_WORDS_CATALOG.every(w=>PICTLINGO_BUNDLED_IDS.includes(w.id) && NicolingoOffline.hasSavedScene(w))"));
            js(scenario,"window.bundleTest='running';(async()=>{try{const r=new WordBloomReviewedScenes.Runtime({meta:PICTURE_WORDS_CATALOG_META,offline:NicolingoOffline});const fetchBefore=window.fetch;window.fetch=()=>{throw Error('Network forbidden')};try{for(const i of [0,Math.floor(PICTURE_WORDS_CATALOG.length/2),PICTURE_WORDS_CATALOG.length-1]){const result=await r.prepare(PICTURE_WORDS_CATALOG[i]);if(!result.playable||!result.imageVerified)throw Error(result.reason);}}finally{window.fetch=fetchBefore;}window.bundleTest='passed';}catch(e){window.bundleTest=String(e);}})()");
            waitFor(scenario,"window.bundleTest!=='running'");
            assertEquals("\"passed\"",js(scenario,"window.bundleTest"));
        }
    }
}