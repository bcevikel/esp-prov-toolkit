/**
 * OptionalCppBridge.swift
 *
 * This file provides compatibility between C++ std::optional syntax and Swift optionals.
 *
 * BACKGROUND:
 * When using React Native's New Architecture with NitroModules, TypeScript interfaces with
 * optional properties (marked with '?') are converted to Swift code. However, the generator
 * sometimes incorrectly uses C++ std::optional syntax instead of Swift's native optional syntax.
 *
 * For example, TypeScript like:
 *   interface PTSessionResult {
 *     status?: PTSessionStatus;  // Optional enum
 *   }
 *
 * Gets converted to Swift code that tries to use:
 *   self.__status.has_value() ? self.__status.pointee : nil
 *
 * THE PROBLEM:
 * Swift optionals don't have 'has_value()' or 'pointee' methods, which are C++ concepts.
 * This causes compiler errors like:
 *   "value of type 'std::__1::optional<PTSessionStatus>' has no member 'has_value'"
 *
 * THE SOLUTION:
 * This extension adds those C++ methods to Swift's Optional type, creating a bridge
 * between the two languages' optional handling patterns. This lets the generated
 * code compile and work as expected without modifying the generator itself.
 *
 * WHY THIS ISSUE OCCURS:
 * The NitroModule code generator likely has some internal C++ bridging logic that
 * sometimes leaks through to the generated Swift code. This happens particularly
 * with optional enum types, where C++ and Swift have different optional handling patterns.
 *
 * WHY THIS WORKS LOCALLY BUT FAILS IN CI:
 * CI environments often use stricter compiler settings or different Xcode/Swift versions
 * than local development environments, which can expose these compatibility issues.
 */

import Foundation

// Extension that adds C++ std::optional-style methods to Swift's Optional type
extension Optional {
    /**
     * Mimics std::optional::has_value() method from C++
     * Returns true if the optional contains a value, false otherwise
     */
    func has_value() -> Bool {
        return self != nil
    }
    
    /**
     * Mimics std::optional's pointee concept from C++
     * Returns the wrapped value if it exists, or nil otherwise
     * This matches how C++ would access the value inside an optional
     */
    var pointee: Wrapped? {
        return self
    }
}

/**
 * USAGE NOTES:
 *
 * 1. Simply add this file to your iOS project
 * 2. It will automatically make all Swift optionals compatible with C++ optional syntax
 * 3. No other changes are needed - the compiler will find these methods at runtime
 *
 * This is a workaround for code generation issues and doesn't affect normal Swift code.
 * It only comes into play when the generated code tries to use C++ optional syntax.
 */
