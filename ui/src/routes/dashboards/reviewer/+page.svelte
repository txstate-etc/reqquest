<script lang="ts">
  import type { PageData } from './$types'
  import { Tab, TabContent, Tabs, Tile } from 'carbon-components-svelte'
  import ReviewerList from '$lib/components/ReviewerList.svelte'
    import { DateTime } from 'luxon'

  export let data: PageData
  console.log(data)
  $: ({ appRequests, period } = data)

  $: formattedData = appRequests.reduce((acc, curr) => {

    if (curr.complete) acc.completed.push(curr)
    if (!curr.complete) acc.awaitingReview.push(curr)

    return acc
  }, { awaitingReview: [] as PageData['appRequests'], inProgress: [] as PageData['appRequests'], completed: [] as PageData['appRequests'] })

</script>

<div class='[ px-8 ]'>
  <div class="[ flex justify-between flex-wrap ]">
    <div class="[ flex gap-2 flex-wrap ]">
      <Tile class='[ flex flex-col gap-4 ]'>
        <span class='[ text-lg ]'>Period Closes</span>
        <span>{period.closeDate && DateTime.fromISO(period.closeDate).toFormat('f')}</span>
      </Tile>
      <Tile class='[ flex flex-col gap-4 ]'>
        <span class='[ text-lg ]'>
          Period Opens
        </span>
        <span>{DateTime.fromISO(period.openDate).toFormat('f')}</span>
      </Tile>
      <Tile>
        <span class='[ text-lg ]'>
          Review Closes
        </span>
      </Tile>
      <Tile>
        <span class='[ text-lg ]'>
          Review Opens
        </span>
      </Tile>
    </div>
    
    <Tile class='[ flex flex-col gap-4 ]'>
      <span class='[ text-lg ]'>
        {formattedData.awaitingReview.length}
      </span>
      <span>Applications to review</span>
    </Tile>
  </div>

  <Tabs autoWidth>
    <Tab label='Awaiting Review' />
    <Tab label='Review in Progress' />
    <Tab label='Completed Review' />
    <svelte:fragment slot='content'>
      <TabContent>
        <ReviewerList
          title='Review not started'
          subtitle='There are applications waiting to be reviewed'
          data={formattedData.awaitingReview}
        />
      </TabContent>
      <TabContent>
        <ReviewerList
          title='Review in progress'
          subtitle='These are applications that are in progress, if you are looking for reviews you have participated in, filter by your name.'
          data={formattedData.inProgress}
        />
      </TabContent>
      <TabContent>
        <ReviewerList
          title='Completed reviews'
          subtitle='No further action is needed from reviewers at this time.'
          data={formattedData.completed}
        />
      </TabContent>
    </svelte:fragment>
  </Tabs>
</div>
