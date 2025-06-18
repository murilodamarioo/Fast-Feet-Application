import { Notification } from '@/domain/notification/enterprise/entities/notification'

export abstract class NotificationsRepository {

  /**
   * Finds a notification entity by its unique identifier.
   *
   * @param notificationId - The unique identifier of the notification.
   * @returns A promise that resolves to the notification entity if found, or null if not found.
   */
  abstract findById(notificationId: string): Promise<Notification | null>

  /**
   * Persists a new notification entity in the repository.
   *
   * @param notification - The notification entity to be created and stored.
   * @returns A promise that resolves when the operation is complete.
   */
  abstract create(notification: Notification): Promise<void>

  /**
   * Updates an existing notification entity in the repository.
   *
   * @param notification - The notification entity to be updated.
   * @returns A promise that resolves when the operation is complete.
   */
  abstract save(notification: Notification): Promise<void>
}