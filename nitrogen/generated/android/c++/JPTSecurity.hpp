///
/// JPTSecurity.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

#include <fbjni/fbjni.h>
#include "PTSecurity.hpp"

namespace margelo::nitro::espprovtoolkit {

  using namespace facebook;

  /**
   * The C++ JNI bridge between the C++ enum "PTSecurity" and the the Kotlin enum "PTSecurity".
   */
  struct JPTSecurity final: public jni::JavaClass<JPTSecurity> {
  public:
    static auto constexpr kJavaDescriptor = "Lcom/margelo/nitro/espprovtoolkit/PTSecurity;";

  public:
    /**
     * Convert this Java/Kotlin-based enum to the C++ enum PTSecurity.
     */
    [[maybe_unused]]
    [[nodiscard]]
    PTSecurity toCpp() const {
      static const auto clazz = javaClassStatic();
      static const auto fieldOrdinal = clazz->getField<int>("_ordinal");
      int ordinal = this->getFieldValue(fieldOrdinal);
      return static_cast<PTSecurity>(ordinal);
    }

  public:
    /**
     * Create a Java/Kotlin-based enum with the given C++ enum's value.
     */
    [[maybe_unused]]
    static jni::alias_ref<JPTSecurity> fromCpp(PTSecurity value) {
      static const auto clazz = javaClassStatic();
      static const auto fieldSECURITY_0 = clazz->getStaticField<JPTSecurity>("SECURITY_0");
      static const auto fieldSECURITY_1 = clazz->getStaticField<JPTSecurity>("SECURITY_1");
      static const auto fieldSECURITY_2 = clazz->getStaticField<JPTSecurity>("SECURITY_2");
      
      switch (value) {
        case PTSecurity::SECURITY_0:
          return clazz->getStaticFieldValue(fieldSECURITY_0);
        case PTSecurity::SECURITY_1:
          return clazz->getStaticFieldValue(fieldSECURITY_1);
        case PTSecurity::SECURITY_2:
          return clazz->getStaticFieldValue(fieldSECURITY_2);
        default:
          std::string stringValue = std::to_string(static_cast<int>(value));
          throw std::invalid_argument("Invalid enum value (" + stringValue + "!");
      }
    }
  };

} // namespace margelo::nitro::espprovtoolkit
