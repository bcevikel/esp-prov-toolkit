package com.margelo.nitro.espprovtoolkit
  
import com.facebook.proguard.annotations.DoNotStrip

@DoNotStrip
class EspProvToolkit : HybridEspProvToolkitSpec() {
  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }
}
