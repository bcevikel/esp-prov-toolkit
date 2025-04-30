package com.margelo.nitro.espprovtoolkit
import com.margelo.nitro.espprovtoolkit.PTExtendedError

/**
 * Exception class for Extended Errors
 * Extends RuntimeException to make it throwable without requiring explicit catches
 */
class PTException(
  val error: PTExtendedError,
  message: String? = null,
  cause: Throwable? = null
) : RuntimeException(
  message ?: error.getDescription(),
  cause
) {
  // Get the error code
  fun getCode(): Int = error.code

  // Convenience constructor that accepts just the error code
  constructor(errorCode: Int, message: String? = null, cause: Throwable? = null) :
    this(PTExtendedError.fromCodeOrDefault(errorCode), message, cause)
}

