package com.margelo.nitro.espprovtoolkit

// This class is needed, because Kotlin does not allow int enums.
enum class PTExtendedError(val code: Int) {
  // WIFI Scan Request Errors
  WIFI_SCAN_EMPTY_CONFIG_DATA (1),
  WIFI_SCAN_EMPTY_RESULT_COUNT (2),
  WIFI_SCAN_REQUEST_ERROR (3), // A general error

  // ESP Session Errors
  SESSION_INIT_ERROR (11),
  SESSION_NOT_ESTABLISHED(12),
  SESSION_SEND_DATA_ERROR(13),
  SOFTAP_CONNECTION_FAILURE(14),
  SESSION_SECURITY_MISMATCH(15),
  SESSION_VERSION_INFO_ERROR(16),
  BLE_FAILED_TO_CONNECT(17),
  ENCRYPTION_ERROR(18),
  NO_POP(19),
  NO_USERNAME(20),

  // Create, Scan, Search Errors - most dont apply to us.
  CAMERA_NOT_AVAILABLE (21),
  CAMERA_ACCESS_DENIED(22),
  AV_CAPTURE_DEVICE_INPUT_ERROR(23),
  VIDEO_INPUT_ERROR (24),
  VIDEO_OUTPUT_ERROR (25),
  INVALID_QR_CODE (26),
  BLE_SEARCH_ERROR (46),
  ESP_DEVICE_NOT_FOUND (27),
  AP_SEARCH_NOT_SUPPORTED(28),

  // ESP Provision Errors
  PROV_SESSION_ERROR (31),
  PROV_CONFIGURATION_ERROR (32),
  PROV_WIFI_STATUS_ERROR (33),
  PROV_WIFI_STATUS_DISCONNECTED (34),
  PROV_WIFI_STATUS_AUTH_ERROR (35),
  PROV_WIFI_STATUS_NETWORK_NOT_FOUND (36),
  PROV_WIFI_STATUS_UNKNOWN_ERROR (37),
  PROV_TIMED_OUT_ERROR (45),
  PROV_UNKNOWN_ERROR (38), // Actual ESP supplied errors end at 38.

  // Swift/Kotlin runtime errors
  RUNTIME_BAD_CLOSURE_ARGS (41),
  RUNTIME_DOES_NOT_EXIST_LOCALLY (42),
  RUNTIME_BAD_BASE64_DATA (43),
  RUNTIME_UNKNOWN_ERROR (44),

  // General Errors
  ESP_NATIVE_UNKNOWN_ERROR (4),
  ESP_INSUFFICIENT_PERMISSIONS(47),
  BLE_ADAPTER_NOT_AVAILABLE(48);
  // Convert to numeric types
  fun toInt(): Int = code
  fun toDouble(): Double = code.toDouble()
  companion object {
    // Mapping of error codes to their possible descriptions
    private val descriptionMap = mapOf(
      1 to listOf("Empty config data during WiFi scan", "Config data is empty"), // WIFI_SCAN_EMPTY_CONFIG_DATA
      3 to listOf("Failed to send Wi-Fi scan command.",
        "Failed to get Wi-Fi Networks.", "Failed to get Wi-Fi status."), //  WIFI_SCAN_REQUEST_ERROR
      11 to listOf("Failed to create session."), // SESSION_INIT_ERROR
      12 to listOf("Session could not be established", "Session establishment failed !"), // SESSION_NOT_ESTABLISHED
      13 to listOf("Failed to send wifi credentials to device","No response from device"), // SESSION_SEND_DATA_ERROR
      14 to listOf("Error ! Connection Lost"), // SOFTAP_CONNECTION_FAILURE
      15 to listOf("Security version mismatch"),  // SESSION_SECURITY_MISMATCH
      17 to listOf("Characteristic is not available for given path.",
        "Read from BLE failed", "Write to BLE failed"), // BLE_FAILED_TO_CONNECT
      18 to listOf("The public client value 'A' must not be null",
        "The client evidence message 'M1' must not be null",
        "The client public value 'A' must not be null",
        "State violation",
        "The SRP-6a crypto parameters must not be null", "Unsupported hash algorithm",
        "The salt 's' must not be null", "The verifier 'v' must not be null", "The timeout must be zero",
        "The attribute key must not be null",
        "The public server value 'B' must not be null", "Bad client public value",
        "Session timeout", "Bad server public value", "The server evidence message",
        "Bad server credentials", "Undefined hash algorithm", "The prime parameter",
        "The generator parameter", "The cause type must not be null"),  // ENCRYPTION_ERROR
      19 to listOf("The user password 'P' must not be null"), // NO_POP
      20 to listOf("The user identity 'I' must not be null or empty"), // NO_USERNAME
      32 to listOf("Failed to apply wifi credentials"), // PROV_CONFIGURATION_ERROR
      37 to listOf("Provisioning Failed"), // PROV_WIFI_STATUS_UNKNOWN_ERROR
      46 to listOf("BLE scanning failed with error code"), // BLE_SEARCH_ERROR
      48 to listOf("Please turn on bluetooth and try again.") // BLE_ADAPTER_NOT_AVAILABLE
    )
     // Find by int code
    fun fromCode(code: Int): PTExtendedError? =
      entries.find { it.code == code }

    // Safely convert from int, with a default fallback
    fun fromCodeOrDefault(code: Int, default: PTExtendedError = ESP_NATIVE_UNKNOWN_ERROR): PTExtendedError =
      fromCode(code) ?: default

    // Get descriptions for an error code
    fun getDescriptions(code: Int): List<String> =
      descriptionMap[code] ?: listOf("Unknown error")

    // Get descriptions for an error enum
    fun getDescriptions(error: PTExtendedError): List<String> =
      getDescriptions(error.code)

    // Find error code from partial description
    private fun findErrorCodeByDescription(partialDesc: String): Int? {

      val lowerPartial = partialDesc.lowercase()

      for ((code, descriptions) in descriptionMap) {
        for (desc in descriptions) {
          if (lowerPartial.contains(desc.lowercase())) {
            return code
          }
        }
      }

      return null
    }

    // Find error enum from partial description
    fun fromDescription(partialDesc: String): PTExtendedError? {
      val code = findErrorCodeByDescription(partialDesc)
      return code?.let { fromCode(it) }
  }
    // Find error enum from partial description with default
    fun fromDescriptionOrDefault(partialDesc: String, default: PTExtendedError = ESP_NATIVE_UNKNOWN_ERROR): PTExtendedError {
      val code = findErrorCodeByDescription(partialDesc)
      return code?.let { fromCodeOrDefault(it,default) } ?: default
    }

  }
  fun getDescription(): String {
    return descriptionMap[this.code]?.get(0) ?: "Unknown error"
  }
}

// Extension function to allow direct conversion from Int to PTExtendedError
fun Int.toPTExtendedError(): PTExtendedError? = PTExtendedError.fromCode(this)
