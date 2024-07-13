import { wsRequest } from "@/lib/ws";
import { Device } from "mediasoup-client";
import { RtpParameters, MediaKind, DtlsParameters, IceCandidate, IceParameters, Transport } from "mediasoup-client/lib/types";

export const device = new Device()

export async function createWebRtcTransport() {
  return wsRequest<{
    id: string;
    iceParameters: IceParameters;
    iceCandidates: IceCandidate[];
    dtlsParameters: DtlsParameters;
  }>("room:event", {
    type: "CREATE_WEBRTC_TRANSPORT"
  })
}

export async function connectTransport(transportId: string, dtlsParameters: DtlsParameters) {
  return wsRequest<{ connection: string }>("room:event", {
    type: "CONNECT_TRANSPORT",
    data: {
      transportId,
      dtlsParameters
    }
  })
}

export async function produce({ producerId, kind, rtpParameters }: {
  producerId: string,
  kind: MediaKind,
  rtpParameters: RtpParameters
}) {
  return wsRequest<{ producerId: string }>("room:event", {
    type: "PRODUCE",
    data: {
      producerId,
      kind,
      rtpParameters
    }
  })
}

export async function getConsumeMedia(producerId: string, recvTransport: Transport) {
  const payload = await wsRequest<
    {
      id: string;
      producerId: string;
      kind: MediaKind,
      rtpParameters: RtpParameters
    }>("room:event", {
      type: "CONSUME",
      data: {
        rtpCapabilities: device.rtpCapabilities,
        consumerId: recvTransport.id,
        producerId
      }
    })

  const consumer = await recvTransport.consume({
    id: payload.id,
    producerId: payload.producerId,
    kind: payload.kind,
    rtpParameters: payload.rtpParameters,
  })

  return consumer
}

export function getUserMedia(options?: MediaStreamConstraints) {
  return navigator.mediaDevices.getUserMedia(options)
}