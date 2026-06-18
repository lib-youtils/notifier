
imagine an app that notifies users.

the goal is something like this:

there are 2 party here. subscribers and publishers.
publisher create an event and other users can subscribe to that event.
now the notification can be triggered in many ways.
    - for example, a publisher can trigger the notification manually (with a button press).
    - or the notification can be triggered by an external event (e.g. a webhook from a third-party service).
    - or the notification can be triggered by a scheduled task (e.g. a cron job that runs every hour and checks for certain conditions to trigger notifications).
    - or the notification can be triggered in one or a series of times (like 9pm, then 11pm then 5pm the next day or every day). Kinda like a calender
    - Event can be recurring notifications that are sent at regular intervals (e.g. daily, weekly, monthly) to subscribers.
    - A event can be also like a group where anyone in the group can trigger notifications.

It is also kind of like a social media platform where users can follow each other and get notifications when someone they follow creates an event or triggers a notification.
Friends can trigger notification with message or memes too.



UI:
    The UI is going to only for phone.

    Screens:
        1. Dashboard: Shows my created and joined events,
        Each event will have details and an edit options.
        2. Notifications: Shows all the notifications from the events I joined or created.
        3. Create Event: A form to create a new event.
        4. Settings: A place to customize the app settings and preferences.
        5. Quick Trigger: A screen to quickly trigger a preselected notification.
        6. Home Screen: The immediate screen when the app is opened. It can be customized by the user to show either the Quick Trigger, Dashboard, or Calendar view. But by default, it will show the Quick Trigger screen for easy access to trigger notifications. It needs to be one screen. Multiple screens cominely will be confusing for the user. So we will use a single screen with a slideable interface to navigate between different sections of the app.
        7. QR Scanner: A screen to scan QR codes to quickly join events or trigger notifications.
        8. Show QR Code: A screen to show QR codes for events that users can share with others to quickly join events or trigger notifications.
        Users can also save the QR codes to their gallery for easy access and sharing.
        9. Notify: It can be in 2 ways.
            - Regular notification
            - Urgent notification (like a call with ringtone and vibration)
            - Silent notification (no sound or vibration, just a visual cue)
        10. Authentication: A screen for users to sign up, log in, and manage their account settings. This is optional.



    Navigation:
        - The navigation will be done by sliding the screen left or right. The user can slide to the left to access the Quick Trigger screen, and slide to the right to access the Dashboard and Notifications screens.
        - There will also be a bottom navigation bar with icons for each section of the app (Home, Dashboard, Notifications, Settings) for quick access. The user can tap on the icons to navigate to the respective sections as well.
        - To navigate to the Create Event screen, the user can tap on a floating action button (FAB) that is prominently displayed on the Home Screen. This FAB will be easily accessible and will allow users to quickly create new events from any section of the app.
        - To scan or show QR codes, there will be a dedicated button on the Home Screen that takes the user to the QR Scanner screen. This will allow users to easily join events or trigger notifications by scanning QR codes. This will look kinda like wifi scan or show qr ui.

    Design:
        - The design will be clean and minimalistic, with a focus on usability and ease of navigation. The color scheme will be vibrant and engaging, with a mix of bright and pastel colors to create a visually appealing interface.
        - The typography will be clear and legible, with a mix of bold and regular fonts to create a hierarchy of information. The icons will be simple and intuitive, making it easy for users to understand the functionality of each button and section of the app.
        - The overall design will be modern and user-friendly, with a focus on providing a seamless experience for users to create, join, and manage events, as well as receive and interact with notifications. The app will also be optimized for performance and responsiveness, ensuring that users can easily navigate and interact with the app without any lag or delays. The design will also be adaptable to different screen sizes and orientations, providing a consistent experience across various devices. The use of animations and transitions will be subtle and smooth, enhancing the user experience without being distracting.

    Features:
        - Event Creation: Users can create events with customizable options such as event name, description, date and time, recurrence, and notification settings. They can also choose to make the event public or private, and invite specific users or groups to join the event.
        - Event Management: Users can manage their created events by editing event details, adding or removing subscribers, and deleting events. They can also view a list of their created events and the events they have joined in the Dashboard section.
        - Notifications: Users can receive notifications for the events they have joined or created. They can customize their notification preferences, such as choosing to receive regular, urgent, or silent notifications. They can also view a history of received notifications in the Notifications section, and interact with them by marking them as read, replying to them, or sharing them with others.
        - Quick Trigger: Users can quickly trigger preselected notifications from the Quick Trigger screen. They can customize their quick trigger options, such as selecting specific events or creating custom messages for the notifications. This allows users to easily send notifications without having to navigate through the app to find the event and trigger the notification manually.
        - QR Code Integration: Users can scan QR codes to quickly join events or trigger notifications. This feature allows for easy and convenient access to events and notifications, especially in situations where users may not have the time or ability to navigate through the app to find and join events or trigger notifications manually. Users can also generate QR codes for their events, allowing others to easily join by scanning the code. This can be particularly useful for events that are open to the public or for quickly sharing event details with others. The QR code integration will enhance the user experience by providing a seamless way to access events and notifications, making it easier for users to stay connected and engaged with the app.





