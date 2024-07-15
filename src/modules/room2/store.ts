import { createStore } from "effector";
import { IRoomClientStore } from "./type";
import { addConsumerEvent, addPeerEvent, addPeersListEvent, addProducerEvent, removePeerEvent } from "./events";

export const $roomClientStore = createStore<IRoomClientStore>({
  peers: {},
  producers: {},
  consumers: {},

  messages: [
    {
      uuid: 'h1',
      content: "Hello",
      isMe: true,
      createdAt: '12:23',
      author: 'Me'
    },
    {
      uuid: 'h2',
      content: "Hello, How are you?",
      isMe: false,
      createdAt: '12:23',
      author: 'Admin'
    }
  ]
})

$roomClientStore.on(addPeersListEvent, (state, peers) => ({
  ...state,
  peers: peers.reduce((acc, peer) => ({ ...acc, [peer.peerId]: peer }), {})
}))
// Add peer
$roomClientStore.on(addPeerEvent, (state, peer) => ({
  ...state,
  peers: {
    ...state.peers,
    [peer.peerId]: peer
  }
}))

// Remove peer
$roomClientStore.on(removePeerEvent, (state, { peerId }) => {
  const peers = { ...state.peers }

  delete peers[peerId]
  return {
    ...state,
    peers
  }
})
// Added New Producer
$roomClientStore.on(addProducerEvent, (state, producer) => ({
  ...state,
  producers: {
    ...state.producers,
    [producer.id]: producer
  }
}))
// Add New Consumer
$roomClientStore.on(addConsumerEvent, (state, consumer) => {
  const { peerId } = consumer.appData as { peerId: string }

  const peers = { ...state.peers }

  peers[peerId].consumers.push(consumer.id)

  return {
    ...state,
    peers,
    consumers: {
      ...state.consumers,
      [consumer.id]: consumer
    }
  }
})