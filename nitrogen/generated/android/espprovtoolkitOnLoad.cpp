///
/// espprovtoolkitOnLoad.cpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#ifndef BUILDING_ESPPROVTOOLKIT_WITH_GENERATED_CMAKE_PROJECT
#error espprovtoolkitOnLoad.cpp is not being built with the autogenerated CMakeLists.txt project. Is a different CMakeLists.txt building this?
#endif

#include "espprovtoolkitOnLoad.hpp"

#include <jni.h>
#include <fbjni/fbjni.h>
#include <NitroModules/HybridObjectRegistry.hpp>

#include "JHybridEspProvToolkitSpec.hpp"
#include "JFunc_std__shared_ptr_Promise_bool___PTLocationAccess.hpp"
#include <NitroModules/JNISharedPtr.hpp>
#include <NitroModules/DefaultConstructableObject.hpp>

namespace margelo::nitro::espprovtoolkit {

int initialize(JavaVM* vm) {
  using namespace margelo::nitro;
  using namespace margelo::nitro::espprovtoolkit;
  using namespace facebook;

  return facebook::jni::initialize(vm, [] {
    // Register native JNI methods
    margelo::nitro::espprovtoolkit::JHybridEspProvToolkitSpec::registerNatives();
    margelo::nitro::espprovtoolkit::JFunc_std__shared_ptr_Promise_bool___PTLocationAccess_cxx::registerNatives();

    // Register Nitro Hybrid Objects
    HybridObjectRegistry::registerHybridObjectConstructor(
      "EspProvToolkit",
      []() -> std::shared_ptr<HybridObject> {
        static DefaultConstructableObject<JHybridEspProvToolkitSpec::javaobject> object("com/margelo/nitro/espprovtoolkit/EspProvToolkit");
        auto instance = object.create();
        auto globalRef = jni::make_global(instance);
        return JNISharedPtr::make_shared_from_jni<JHybridEspProvToolkitSpec>(globalRef);
      }
    );
  });
}

} // namespace margelo::nitro::espprovtoolkit
