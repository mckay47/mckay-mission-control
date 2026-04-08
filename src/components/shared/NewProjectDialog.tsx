import LaunchWizard from './LaunchWizard.tsx'

interface NewProjectDialogProps {
  open: boolean
  onClose: () => void
}

export default function NewProjectDialog({ open, onClose }: NewProjectDialogProps) {
  return <LaunchWizard open={open} onClose={onClose} />
}
