<script setup lang="ts">
import Layout from '@/components/Layout.vue'
import NotificationDialog from '@/components/NotificationDialog.vue'
import { useNotification } from '@/composables/useNotification'

const { notification, hideNotification } = useNotification()
</script>

<template>
  <Layout />
  <NotificationDialog
    :message="notification.message"
    :type="notification.type"
    :visible="notification.visible"
    @close="hideNotification"
  />
</template>
