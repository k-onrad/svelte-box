<script>
  import { onMount } from 'svelte'
  import { Http } from '../../services/http.js'

  let data = []

  onMount(async function () {
    const response = await Http.Request('GET', '/link/')
    data = response
  })
</script>

<style src="./FetchExample.styles.scss"></style>

<div class="fetch-example">
  <ul>
    {#each data as link}
      <li>
        <a href={link.url}>{link.title}</a>
      </li>
    {/each}
  </ul>
</div>
