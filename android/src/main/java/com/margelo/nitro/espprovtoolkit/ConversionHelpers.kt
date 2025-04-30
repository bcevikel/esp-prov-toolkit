package com.margelo.nitro.espprovtoolkit
import com.margelo.nitro.espprovtoolkit.PTSecurity
import com.margelo.nitro.espprovtoolkit.PTTransport

import com.espressif.provisioning.ESPConstants.SecurityType
import com.espressif.provisioning.ESPConstants.TransportType


class ConversionHelpers {
  companion object{
    fun convertSecurity(security : SecurityType): PTSecurity{
      return when (security){
        SecurityType.SECURITY_0 -> PTSecurity.SECURITY_0
        SecurityType.SECURITY_1 -> PTSecurity.SECURITY_1
        SecurityType.SECURITY_2 -> PTSecurity.SECURITY_2
      }
    }
    fun convertSecurity(security : PTSecurity): SecurityType{
      return when (security){
        PTSecurity.SECURITY_0 -> SecurityType.SECURITY_0
        PTSecurity.SECURITY_1 -> SecurityType.SECURITY_1
        PTSecurity.SECURITY_2 -> SecurityType.SECURITY_2
      }
    }
    fun convertTransport(transport : TransportType) : PTTransport{
      return when (transport){
        TransportType.TRANSPORT_SOFTAP -> PTTransport.TRANSPORT_SOFTAP
        TransportType.TRANSPORT_BLE -> PTTransport.TRANSPORT_BLE
      }
    }
    fun convertTransport(transport : PTTransport) : TransportType{
      return when (transport){
        PTTransport.TRANSPORT_SOFTAP -> TransportType.TRANSPORT_SOFTAP
        PTTransport.TRANSPORT_BLE -> TransportType.TRANSPORT_BLE
      }
    }
  }
}
