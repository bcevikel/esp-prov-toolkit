#include <jni.h>
#include "espprovtoolkitOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::espprovtoolkit::initialize(vm);
}
