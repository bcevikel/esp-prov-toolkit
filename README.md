# 🚀 ESP Provisioning Toolkit

> **Note**: This project is currently under active development. While iOS support is available, Android support is coming soon! 🛠️

## 🌟 Features

- **Fully Async API** 🔄
  - Wraps closures and handles multiple callback invocations
  - Clean and modern Swift-based implementation

- **Nitro Architecture** ⚡
  - Direct Swift execution without Objective-C intermediaries
  - Optimized performance and reduced overhead

- **New Architecture Compatible** 🏗️
  - Supports synchronous JS execution
  - Future-proof design

- **Layered API Design** 🎯
  - Direct native API access for maximum control
  - Separated hooks for modular usage
  - High-level hooks for quick implementation
  - Documentation coming soon

- **Multiple Provisioning Methods** 📡
  - SoftAP support
  - BLE support
  - Security levels 0, 1, and 2

- **Enhanced Stability** 🛡️
  - Patches and workarounds for Espressif library limitations
  - Improved reliability and performance

## 🚧 Current Status

- ✅ iOS support available
- 🔜 Android support coming soon

## 🤔 Why Workarounds Instead of Fixes?

The Espressif libraries present some architectural challenges:
- Limited access to internal components (private/fileprivate)
- Architectural limitations that prevent direct fixes
- No ability to extend certain critical components

We've implemented workarounds to ensure stability and functionality. However, if there's community interest, we're open to creating a new branch where we can:
- Rewrite the iOS/Android libraries from scratch
- Implement proper fixes at the root level
- Create a more maintainable and extensible solution

## 🔮 Future Plans

- Android support implementation
- Community-driven improvements
- Potential ground-up rewrite based on community interest

## 📝 License

[Add your license information here]

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

*This project is actively maintained and developed. Stay tuned for updates!* 🎉
