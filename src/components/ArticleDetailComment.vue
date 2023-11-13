<template>
  <div class="card">
    <div class="card-block"
    data-test="posted-comment">
      <p class="card-text"
      data-test="posted-comment-text">
        {{ comment.body }}
      </p>
    </div>

    <div class="card-footer">
      <AppLink
        name="profile"
        :params="{username: comment.author.username}"
        class="comment-author"
      >
        <img
          :src="comment.author.image"
          class="comment-author-img"
          data-test="author-profile-picture"
          :alt="comment.author.username"
        >
      </AppLink>

      &nbsp;

      <AppLink
        name="profile"
        :params="{username: comment.author.username}"
        class="comment-author"
        data-test="author-profile"
      >
        {{ comment.author.username }}
      </AppLink>

      <span class="date-posted"
      data-test="comment-date-posted">{{ (new Date(comment.createdAt)).toLocaleDateString('en-US') }}</span>

      <span class="mod-options">
        <i
          v-if="showRemove"
          tabindex="0"
          role="button"
          aria-label="Delete comment"
          class="ion-trash-a"
          data-test="delete-comment"
          @click="emit('remove-comment')"
          @keypress.enter="emit('remove-comment')"
        />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Comment } from 'src/services/api'

interface Props {
  comment: Comment
  username?: string
}
const props = defineProps<Props>()

interface Emits {
  (e: 'remove-comment'): boolean
}
const emit = defineEmits<Emits>()

const showRemove = computed(() => props.username !== undefined && props.username === props.comment.author.username)
</script>
