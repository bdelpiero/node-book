import { createServer } from 'http'
import timestamp from 'monotonic-timestamp'
import JSONStream from 'JSONStream'
import amqp from 'amqplib'
import { Readable } from 'stream'
import { Level } from 'level';


async function main () {
  const db = new Level('./msgHistory');

  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  await channel.assertExchange('chat', 'fanout')
  const { queue } = channel.assertQueue('chat_history')
  await channel.bindQueue(queue, 'chat')

  channel.consume(queue, async msg => {
    const content = msg.content.toString()
    console.log(`Saving message: ${content}`)
    await db.put(timestamp(), content)
    channel.ack(msg)
  })

  createServer(async (req, res) => {
    // Create a readable stream from the iterator
    const valueStream = Readable.from((async function* () {
      for await (const [, value] of db.iterator()) {
        yield value
      }
    })())

    // Pipe through JSONStream.stringify
    valueStream.pipe(JSONStream.stringify()).pipe(res)
  }).listen(8090)
}

main().catch(err => console.error(err))