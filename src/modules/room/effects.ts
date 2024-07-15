import { wsRequest } from "@/lib/ws";
import { connectTransport, createWebRtcTransport, device, getConsumeMedia, getUserMedia, produce } from "@/lib/device";
import { createEffect } from "effector";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { IPeer } from "./type";
import { Transport } from "mediasoup-client/lib/Transport";
import { Consumer } from "mediasoup-client/lib/Consumer";

export const joinRoomEventFx = createEffect(async ({ roomId }: { roomId: string }) => {
  const data = await wsRequest<{
    rtpCapabilities: RtpCapabilities,
    peers: Array<{ peerId: string, producers: string }>
  }>("room:join", { roomId })

  return data
})

export const loadRtpCapabilitiesFx = createEffect(async ({ routerRtpCapabilities }: { routerRtpCapabilities: RtpCapabilities }) => {
  await device.load({
    routerRtpCapabilities
  })
  return { loaded: 'ok' }
})

export const createSendTransportFx = createEffect(async () => {
  const transport = await createWebRtcTransport()
  const sendTransport = device.createSendTransport(transport)

  sendTransport.on("connect", async ({ dtlsParameters }, cb, err) => {
    try {
      await connectTransport(transport.id, dtlsParameters)
      cb()
    } catch (error) {
      err(error as any)
    }
  })

  sendTransport.on("produce", async ({ kind, rtpParameters }, cb, err) => {
    try {
      const { producerId } = await produce({
        producerId: sendTransport.id,
        kind,
        rtpParameters
      })
      cb({ id: producerId })
    } catch (error: any) {
      err(error)
    }
  })

  return sendTransport
})

export const createRecvTransportFx = createEffect(async () => {
  const transport = await createWebRtcTransport()
  const recvTransport = device.createRecvTransport(transport)

  recvTransport.on("connect", async ({ dtlsParameters }, cb, err) => {
    try {
      await connectTransport(transport.id, dtlsParameters)
      cb()
    } catch (error) {
      err(error as any)
    }
  })

  recvTransport.on("connectionstatechange", async (state) => {
    switch (state) {
      case 'connecting':
        console.log("connectiong")
        break

      case 'connected':
        console.log("connected")

        break

      case 'failed':
        recvTransport.close()
        break

      default:
        break
    }
  })


  return recvTransport
})


export const getConsumersMediaFx = createEffect(async ({ recvTransport, peers }: { recvTransport: Transport, peers: { [key: string]: IPeer } }) => {

  const consumers: { [key: string]: Consumer } = {}

  for (const peerId of Object.keys(peers)) {
    const peer = peers[peerId]
    for (const producerId of peer.producers) {
      const consumer = await getConsumeMedia(producerId, recvTransport)
      peer.consumers.push(consumer.id)
      consumers[consumer.id] = consumer
    }
  }

  return consumers
})


export const getConsumerMediaFx = createEffect(async ({ recvTransport, peers, newProducer }: { recvTransport: Transport, newProducer: { peerId: string, producerId: string }, peers: { [key: string]: IPeer } }) => {

  const consumer = await getConsumeMedia(newProducer.producerId, recvTransport)
  peers[newProducer.peerId].consumers.push(consumer.id)
  return consumer
})

export const createVideoProducerFx = createEffect(async ({ sendTransport }: { sendTransport: Transport }) => {
  const stream = await getUserMedia({ video: true })
  const videoProducer = await sendTransport.produce({ track: stream.getVideoTracks()[0] })
  return videoProducer
})
export const createAudioProducerFx = createEffect(async ({ sendTransport }: { sendTransport: Transport }) => {
  const stream = await getUserMedia({ audio: true })
  const audioProducer = await sendTransport.produce({
    track: stream.getAudioTracks()[0], codecOptions:
    {
      opusStereo: true,
      opusDtx: true
    }
  })
  return audioProducer
})