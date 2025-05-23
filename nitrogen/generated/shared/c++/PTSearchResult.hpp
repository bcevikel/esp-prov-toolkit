///
/// PTSearchResult.hpp
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



#include <optional>
#include <vector>
#include <string>

namespace margelo::nitro::espprovtoolkit {

  /**
   * A struct which can be represented as a JavaScript object (PTSearchResult).
   */
  struct PTSearchResult {
  public:
    bool success     SWIFT_PRIVATE;
    std::optional<std::vector<std::string>> deviceNames     SWIFT_PRIVATE;
    std::optional<double> error     SWIFT_PRIVATE;

  public:
    PTSearchResult() = default;
    explicit PTSearchResult(bool success, std::optional<std::vector<std::string>> deviceNames, std::optional<double> error): success(success), deviceNames(deviceNames), error(error) {}
  };

} // namespace margelo::nitro::espprovtoolkit

namespace margelo::nitro {

  using namespace margelo::nitro::espprovtoolkit;

  // C++ PTSearchResult <> JS PTSearchResult (object)
  template <>
  struct JSIConverter<PTSearchResult> final {
    static inline PTSearchResult fromJSI(jsi::Runtime& runtime, const jsi::Value& arg) {
      jsi::Object obj = arg.asObject(runtime);
      return PTSearchResult(
        JSIConverter<bool>::fromJSI(runtime, obj.getProperty(runtime, "success")),
        JSIConverter<std::optional<std::vector<std::string>>>::fromJSI(runtime, obj.getProperty(runtime, "deviceNames")),
        JSIConverter<std::optional<double>>::fromJSI(runtime, obj.getProperty(runtime, "error"))
      );
    }
    static inline jsi::Value toJSI(jsi::Runtime& runtime, const PTSearchResult& arg) {
      jsi::Object obj(runtime);
      obj.setProperty(runtime, "success", JSIConverter<bool>::toJSI(runtime, arg.success));
      obj.setProperty(runtime, "deviceNames", JSIConverter<std::optional<std::vector<std::string>>>::toJSI(runtime, arg.deviceNames));
      obj.setProperty(runtime, "error", JSIConverter<std::optional<double>>::toJSI(runtime, arg.error));
      return obj;
    }
    static inline bool canConvert(jsi::Runtime& runtime, const jsi::Value& value) {
      if (!value.isObject()) {
        return false;
      }
      jsi::Object obj = value.getObject(runtime);
      if (!JSIConverter<bool>::canConvert(runtime, obj.getProperty(runtime, "success"))) return false;
      if (!JSIConverter<std::optional<std::vector<std::string>>>::canConvert(runtime, obj.getProperty(runtime, "deviceNames"))) return false;
      if (!JSIConverter<std::optional<double>>::canConvert(runtime, obj.getProperty(runtime, "error"))) return false;
      return true;
    }
  };

} // namespace margelo::nitro
