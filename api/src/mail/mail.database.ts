export interface MailTemplateRow {
  id: number
  templateKey: string
  description: string
  audience: string
  variables: string
  subject: string
  body: string
  created: Date
  enabled: boolean
}

export interface MailOutboxRow {
  id: number
  templateKey: string
  recipients: string
  variables: string
  status: string
  attempts: number
  sent: Date
  lastError?: Date
  updatedAt: Date
}
