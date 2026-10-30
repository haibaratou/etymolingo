import ctypes,json
from ctypes import wintypes as W
class UNIQUE(ctypes.Structure):_fields_=[('pid',W.DWORD),('start',W.FILETIME)]
class INFO(ctypes.Structure):_fields_=[('process',UNIQUE),('name',W.WCHAR*256),('service',W.WCHAR*64),('kind',ctypes.c_int),('status',W.ULONG),('session',W.DWORD),('restartable',W.BOOL)]
api=ctypes.WinDLL('Rstrtmgr');handle=W.DWORD();key=ctypes.create_unicode_buffer(33)
rc=api.RmStartSession(ctypes.byref(handle),0,key);assert rc==0,rc
try:
 paths=(W.LPCWSTR*1)(r'D:\Projects\etymolingo\work\etymopedia\prompt_rows_image_mismatch_supplement_20261028.csv')
 assert api.RmRegisterResources(handle,1,paths,0,None,0,None)==0
 needed=W.UINT();count=W.UINT();reason=W.DWORD();rc=api.RmGetList(handle,ctypes.byref(needed),ctypes.byref(count),None,ctypes.byref(reason));result=[]
 if rc==234:
  items=(INFO*needed.value)();count.value=needed.value;rc=api.RmGetList(handle,ctypes.byref(needed),ctypes.byref(count),items,ctypes.byref(reason))
  result=[{'pid':x.process.pid,'app':x.name,'service':x.service}for x in items[:count.value]]
 print(json.dumps({'status':rc,'lock_owners':result},ensure_ascii=False))
finally:api.RmEndSession(handle)
