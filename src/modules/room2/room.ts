import { ws, wsRequest } from "@/lib/ws";
import { Device } from "mediasoup-client";
import { MediaKind, RtpCapabilities, RtpParameters } from "mediasoup-client/lib/RtpParameters";
import { $roomClientStore } from "./store";
import { addConsumerEvent, addPeerEvent, addProducerEvent, removePeerEvent } from "./events";
import { IPeer } from "./type";
import { DtlsParameters, IceCandidate, IceParameters, Transport } from "mediasoup-client/lib/Transport";
import { Producer } from "mediasoup-client/lib/Producer";

/* eslint-disable @typescript-eslint/no-this-alias */
let instance: Room

const store = $roomClientStore.getState()

console.log(store)

class Room {
  roomId: string
  device: Device = new Device()
  private sendTransport: Transport
  private recvTransport: Transport
  webcamProducer: Producer


  constructor() {
    if (instance) {
      throw new Error("You can only create one instance!");
    }
    instance = this

    ws.on("room:new_peer", addPeerEvent)
    ws.on("room:leave_peer", removePeerEvent)
    ws.on("room:new_producer", async ({ peerId, producerId }: { peerId: string, producerId: string }) => {
      const { producerId: pId, kind, rtpParameters, id } = await this.consume(producerId)
      const consumer = await this.recvTransport.consume({
        id,
        producerId: pId,
        kind,
        rtpParameters,
        appData: { peerId }
      })

      consumer.resume()

      await this.resume(consumer.id)

      addConsumerEvent(consumer)
    })
  }

  async joinRoom(roomId: string) {
    this.roomId = roomId

    const { peers, rtpCapabilities } = await wsRequest<{
      rtpCapabilities: RtpCapabilities,
      peers: Array<IPeer>
    }>("room:join", { roomId })


    await this.device.load({
      routerRtpCapabilities: rtpCapabilities
    })

    // Create and Connect SendTransport
    {
      const transport = await this.createWebRtcTransport()
      this.sendTransport = this.device.createSendTransport(transport)

      this.sendTransport.on("connect", async ({ dtlsParameters }, cb, cberr) => {

        try {
          await this.connectTransports(transport.id, dtlsParameters)
          cb()
        } catch (error: any) {
          console.error(error)
          cberr(error)
        }
      })

      this.sendTransport.on("produce", async ({ kind, rtpParameters }, cb, cberr) => {
        try {
          const { producerId } = await this.produce({ kind, rtpParameters })
          cb({ id: producerId })
        } catch (error: any) {
          console.error(error)
          cberr(error)
        }
      })
    }

    // Create and Connect RecvTransport
    {
      const transport = await this.createWebRtcTransport()
      this.recvTransport = this.device.createRecvTransport(transport)
      this.recvTransport.on("connect", async ({ dtlsParameters }, cb, cberr) => {
        try {
          await this.connectTransports(transport.id, dtlsParameters)
          cb()
        } catch (error: any) {
          console.error(error)
          cberr(error)
        }
      })

      this.recvTransport.on("connectionstatechange", async (state) => {
        console.warn("recvTransport state", state)
        switch (state) {
          case "failed":
            this.recvTransport.close()
            break;
        }
      })
    }

    for (const peer of peers) {
      addPeerEvent(peer)
      for (const pId of peer.producers) {
        const { producerId, kind, rtpParameters, id } = await this.consume(pId)
        const consumer = await this.recvTransport.consume({
          id,
          producerId,
          kind,
          rtpParameters,
          appData: {
            peerId: peer.peerId
          }
        })

        consumer.resume()

        await this.resume(consumer.id)

        addConsumerEvent(consumer)
      }
    }
  }

  public async enableWebCam() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    const track = stream.getVideoTracks()[0];

    this.webcamProducer = await this.sendTransport.produce({
      track
    })

    addProducerEvent(this.webcamProducer)
  }

  private consume(producerId: string) {
    return wsRequest<
      {
        id: string;
        producerId: string;
        kind: MediaKind,
        rtpParameters: RtpParameters
      }>("room:event", {
        type: "CONSUME",
        data: {
          transportId: this.recvTransport.id,
          rtpCapabilities: this.device.rtpCapabilities,
          producerId
        }
      })
  }

  private resume(consumerId: string) {
    return wsRequest<{ connection: string }>("room:event", {
      type: "RESUME_CONSUMER",
      data: {
        consumerId,
      }
    })
  }

  private produce({ kind, rtpParameters }: {
    kind: MediaKind,
    rtpParameters: RtpParameters
  }) {
    return wsRequest<{ producerId: string }>("room:event", {
      type: "PRODUCE",
      data: {
        transportId: this.sendTransport.id,
        kind,
        rtpParameters
      }
    })
  }

  private connectTransports(transportId: string, dtlsParameters: DtlsParameters) {
    return wsRequest<{ connection: string }>("room:event", {
      type: "CONNECT_TRANSPORT",
      data: {
        transportId,
        dtlsParameters
      }
    })
  }
  private createWebRtcTransport() {
    return wsRequest<{
      id: string;
      iceParameters: IceParameters;
      iceCandidates: IceCandidate[];
      dtlsParameters: DtlsParameters;
    }>("room:event", {
      type: "CREATE_WEBRTC_TRANSPORT"
    })
  }
}

export default new Room();