package com.espprovtoolkit

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfoProvider
import android.util.Log
import com.facebook.react.BaseReactPackage
import com.facebook.react.module.model.ReactModuleInfo
import com.margelo.nitro.espprovtoolkit.Wrappers
class EspProvToolkitPackage : BaseReactPackage() {

    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
      Wrappers.setContext(reactContext)
      return null
    }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfoMap = HashMap<String, ReactModuleInfo>()

      // Register your module with named parameters for the boolean arguments
      moduleInfoMap["EspProvToolkit"] = ReactModuleInfo(
        name = "EspProvToolkit",
        className = "EspProvToolkit",
        canOverrideExistingModule = false,
        needsEagerInit = true, // We must use this - or TurboModules thinks we are unused and never calls getModule
        isCxxModule = false,
        isTurboModule = true
      )

      moduleInfoMap
    }
  }

    companion object {
        init {
            System.loadLibrary("espprovtoolkit")
        }
    }
}
