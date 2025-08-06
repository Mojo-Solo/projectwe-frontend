import { Kafka, Producer, ProducerRecord } from 'kafkajs'
import { randomUUID } from 'crypto'

export interface AITaskMessage {
  id: string
  userId: string
  type: string
  documentId?: string
  input: Record<string, any>
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  metadata?: Record<string, any>
}

export interface TaskResult {
  taskId: string
  correlationId: string
  status: 'completed' | 'failed'
  result?: any
  error?: string
  processingTime?: number
}

class KafkaProducerService {
  private producer: Producer
  private connected: boolean = false
  private kafka: Kafka

  constructor() {
    this.kafka = new Kafka({
      clientId: 'projectwe-frontend',
      brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
      ssl: process.env.KAFKA_SSL === 'true',
      sasl: process.env.KAFKA_SASL_USERNAME ? {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD!,
      } : undefined,
      retry: {
        initialRetryTime: 100,
        retries: 8
      }
    })
    
    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000
    })
  }

  async connect(): Promise<void> {
    if (!this.connected) {
      try {
        await this.producer.connect()
        this.connected = true
        console.log('Kafka producer connected')
      } catch (error) {
        console.error('Failed to connect Kafka producer:', error)
        throw error
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      try {
        await this.producer.disconnect()
        this.connected = false
        console.log('Kafka producer disconnected')
      } catch (error) {
        console.error('Failed to disconnect Kafka producer:', error)
      }
    }
  }

  async sendAITask(task: AITaskMessage): Promise<string> {
    await this.connect()
    
    const correlationId = randomUUID()
    const timestamp = new Date().toISOString()
    
    const message = {
      key: task.id,
      value: JSON.stringify({
        ...task,
        correlationId,
        timestamp,
        version: '1.0'
      }),
      headers: {
        'correlation-id': correlationId,
        'user-id': task.userId,
        'task-type': task.type,
        'priority': task.priority || 'MEDIUM',
        'timestamp': timestamp
      }
    }

    try {
      const result = await this.producer.send({
        topic: 'ai-tasks',
        messages: [message],
        acks: -1, // Wait for all replicas
        timeout: 30000,
        compression: 1 // GZIP
      })

      console.log(`AI task sent successfully: ${task.id}`, result)
      return correlationId
    } catch (error) {
      console.error('Failed to send AI task:', error)
      throw error
    }
  }

  async sendBatch(tasks: AITaskMessage[]): Promise<string[]> {
    await this.connect()
    
    const correlationIds: string[] = []
    const messages = tasks.map(task => {
      const correlationId = randomUUID()
      correlationIds.push(correlationId)
      
      return {
        key: task.id,
        value: JSON.stringify({
          ...task,
          correlationId,
          timestamp: new Date().toISOString(),
          version: '1.0'
        }),
        headers: {
          'correlation-id': correlationId,
          'user-id': task.userId,
          'task-type': task.type,
          'priority': task.priority || 'MEDIUM',
        }
      }
    })

    try {
      await this.producer.send({
        topic: 'ai-tasks',
        messages,
        acks: -1,
        timeout: 30000,
        compression: 1
      })

      console.log(`Batch of ${tasks.length} AI tasks sent successfully`)
      return correlationIds
    } catch (error) {
      console.error('Failed to send batch of AI tasks:', error)
      throw error
    }
  }

  async publishResult(result: TaskResult): Promise<void> {
    await this.connect()
    
    try {
      await this.producer.send({
        topic: 'ai-results',
        messages: [{
          key: result.taskId,
          value: JSON.stringify({
            ...result,
            timestamp: new Date().toISOString()
          }),
          headers: {
            'correlation-id': result.correlationId,
            'status': result.status
          }
        }],
        acks: -1,
        timeout: 30000
      })

      console.log(`Result published for task: ${result.taskId}`)
    } catch (error) {
      console.error('Failed to publish result:', error)
      throw error
    }
  }

  // Health check
  async isHealthy(): Promise<boolean> {
    try {
      await this.connect()
      const admin = this.kafka.admin()
      await admin.connect()
      const topics = await admin.listTopics()
      await admin.disconnect()
      return topics.includes('ai-tasks')
    } catch (error) {
      console.error('Kafka health check failed:', error)
      return false
    }
  }
}

// Singleton instance
let kafkaProducer: KafkaProducerService | null = null

export function getKafkaProducer(): KafkaProducerService {
  if (!kafkaProducer) {
    kafkaProducer = new KafkaProducerService()
  }
  return kafkaProducer
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGINT', async () => {
    if (kafkaProducer) {
      await kafkaProducer.disconnect()
    }
  })

  process.on('SIGTERM', async () => {
    if (kafkaProducer) {
      await kafkaProducer.disconnect()
    }
  })
}