//
//  Errors.swift
//  EspProvToolkit
//
//  Created by Berk Cevikel on 16.04.2025.
//

import Foundation
import ESPProvision

  /// Runtime errors
  public enum ESPRuntimeError: ESPError {

      // The closure returned invalid arguments at runtime.
      case badClosureArgs
      /// The ESP device requested does not exist on this phone.
      case doesNotExistLocally
      /// Bad base64 data
      case badBase64Data
      /// A general unknown error.
      case unknownError
      /// Timed out.
      case operationtimedOut
    
      public var description: String {
          switch self {
          case .badClosureArgs:
              return "The closure got unexpected or invalid arguments at runtime."
          case .doesNotExistLocally:
            return "The ESP device requested does not exist on this phone."
          case .badBase64Data:
            return "The data provided is not proper base64."
          case .operationtimedOut:
            return "Operation timed out while waiting."
          case .unknownError:
              return "An unknown error happened at runtime."
          }
      }
      
      public var code:Int {
          switch self {
          case .badClosureArgs:
              return 41
          case .doesNotExistLocally:
              return 42
          case .badBase64Data:
              return 43
          case .operationtimedOut:
              return 44
          case .unknownError:
              return 45
          }
      }
  }
