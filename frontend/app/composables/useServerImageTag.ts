import { useGitHubStore } from '~/stores/github'

/**
 * Docker image tag of the latest server release for ghcr.io/buggregator/server.
 * GHCR tags carry no «v» (`:2.5.0` exists, `:v2.5.0` is 404), so any leading
 * «v» is stripped; `latest` until the release is known.
 */
export function useServerImageTag() {
  const github = useGitHubStore()
  return computed(() => github.serverVersion?.replace(/^v/i, '') || 'latest')
}
