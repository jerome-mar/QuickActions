package com.quickactions

import android.app.Activity
import android.content.Intent
import android.content.pm.ShortcutInfo
import android.content.pm.ShortcutManager
import android.graphics.drawable.Icon
import android.os.Build
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.*

class QuickActionsManager(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    init {
        Companion.reactApplicationContext = reactContext
    }

    companion object {
        private lateinit var reactApplicationContext: ReactApplicationContext

        fun sendEventToReactNative(shortcutId: String) {
            val params = Arguments.createMap()
            params.putString("shortcut_id", shortcutId)

            // Gửi sự kiện về JavaScript qua React Native
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onQuickActionPress", params)
        }
    }

    override fun getName(): String {
        return "QuickActionsManager"
    }

    @RequiresApi(api = Build.VERSION_CODES.N_MR1)
    @ReactMethod
    fun setQuickActions(ids: ReadableArray, labels: ReadableArray, descriptions: ReadableArray) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N_MR1) {
            val shortcutManager = reactApplicationContext.getSystemService(ShortcutManager::class.java)
            val shortcutInfoList: MutableList<ShortcutInfo> = ArrayList()

            for (i in 0 until ids.size()) {
                val shortcut = ShortcutInfo.Builder(reactApplicationContext, ids.getString(i))
                    .setShortLabel(labels.getString(i))
                    .setLongLabel(descriptions.getString(i))
                    .setIcon(Icon.createWithResource(reactApplicationContext, R.mipmap.ic_launcher))
                    .setIntent(Intent(Intent.ACTION_VIEW).putExtra("shortcut_id", ids.getString(i)))
                    .build()
                shortcutInfoList.add(shortcut)
            }

            shortcutManager?.dynamicShortcuts = shortcutInfoList
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.N_MR1)
    @ReactMethod
    fun removeAllQuickActions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N_MR1) {
            val shortcutManager = reactApplicationContext.getSystemService(ShortcutManager::class.java)
            shortcutManager?.removeAllDynamicShortcuts()
        }
    }

    @ReactMethod
    fun onQuickActionPress(promise: Promise) {
        val currentActivity: Activity? = currentActivity
        if (currentActivity != null && currentActivity.intent != null) {
            val intent = currentActivity.intent
            val shortcutId = intent.getStringExtra("shortcut_id")
            val map = Arguments.createMap()
            map.putString("shortcut_id", shortcutId)
            promise.resolve(map)
        } else {
            promise.reject("NO_INTENT", "No intent found")
        }
    }
}
