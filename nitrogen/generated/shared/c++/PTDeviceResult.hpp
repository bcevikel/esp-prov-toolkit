///
/// PTDeviceResult.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

#if __has_include(<NitroModules/JSIConverter.hpp>)
#include <NitroModules/JSIConverter.hpp>
#else
#error NitroModules cannot be found! Are you sure you installed NitroModules properly?
#endif
#if __has_include(<NitroModules/NitroDefines.hpp>)
#include <NitroModules/NitroDefines.hpp>
#else
#error NitroModules cannot be found! Are you sure you installed NitroModules properly?
#endif

// Forward declaration of `PTDevice` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { struct PTDevice; }

#include <optional>
#include "PTDevice.hpp"

namespace margelo::nitro::espprovtoolkit {

  /**
   * A struct which can be represented as a JavaScript object (PTDeviceResult).
   */
  struct PTDeviceResult {
  public:
    bool success     SWIFT_PRIVATE;
    std::optional<PTDevice> result     SWIFT_PRIVATE;

  public:
    PTDeviceResult() = default;
    explicit PTDeviceResult(bool success, std::optional<PTDevice> result): success(success), result(result) {}
  };

} // namespace margelo::nitro::espprovtoolkit

namespace margelo::nitro {

  using namespace margelo::nitro::espprovtoolkit;

  // C++ PTDeviceResult <> JS PTDeviceResult (object)
  template <>
  struct JSIConverter<PTDeviceResult> final {
    static inline PTDeviceResult fromJSI(jsi::Runtime& runtime, const jsi::Value& arg) {
      jsi::Object obj = arg.asObject(runtime);
      return PTDeviceResult(
        JSIConverter<bool>::fromJSI(runtime, obj.getProperty(runtime, "success")),
        JSIConverter<std::optional<PTDevice>>::fromJSI(runtime, obj.getProperty(runtime, "result"))
      );
    }
    static inline jsi::Value toJSI(jsi::Runtime& runtime, const PTDeviceResult& arg) {
      jsi::Object obj(runtime);
      obj.setProperty(runtime, "success", JSIConverter<bool>::toJSI(runtime, arg.success));
      obj.setProperty(runtime, "result", JSIConverter<std::optional<PTDevice>>::toJSI(runtime, arg.result));
      return obj;
    }
    static inline bool canConvert(jsi::Runtime& runtime, const jsi::Value& value) {
      if (!value.isObject()) {
        return false;
      }
      jsi::Object obj = value.getObject(runtime);
      if (!JSIConverter<bool>::canConvert(runtime, obj.getProperty(runtime, "success"))) return false;
      if (!JSIConverter<std::optional<PTDevice>>::canConvert(runtime, obj.getProperty(runtime, "result"))) return false;
      return true;
    }
  };

} // namespace margelo::nitro
