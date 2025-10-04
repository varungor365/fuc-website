import StatusPage from '../../components/monitoring/StatusPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FASHUN System Status',
  description: 'Real-time status of FASHUN platform services and infrastructure',
}

export default function Status() {
  return <StatusPage />
}