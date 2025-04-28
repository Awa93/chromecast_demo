const castReceiverContext = cast.framework.CastReceiverContext.getInstance();
const playerManager = castReceiverContext.getPlayerManager();
const mediaElement = document.getElementById('media-element');
const overlay = document.getElementById('overlay');

/**
 * Handles the LOAD request from the sender.
 */
playerManager.setMessageInterceptor(cast.framework.messages.MessageType.LOAD, (loadRequest) => {
    console.log('LOAD request received', loadRequest);

    // You can customize the media information here if needed
    const media = new cast.framework.messages.MediaInformation();
    media.contentId = loadRequest.media.contentId;
    media.contentType = loadRequest.media.contentType;
    media.metadata = loadRequest.media.metadata;
    media.streamType = loadRequest.media.streamType;

    // Update the video source
    mediaElement.src = media.contentId;

    return loadRequest;
});

/**
 * Handles media status updates.
 */
playerManager.addEventListener(cast.framework.PlayerManager.EventType.MEDIA_STATUS, (event) => {
    console.log('Media Status:', event);
    // You can update your UI based on the media status (e.g., buffering, playing, paused)
    if (event.playerState === 'BUFFERING') {
        overlay.textContent = 'Buffering...';
        overlay.style.opacity = 1;
    } else if (event.playerState === 'PLAYING') {
        overlay.style.opacity = 0;
    } else if (event.playerState === 'PAUSED') {
        overlay.textContent = 'Paused';
        overlay.style.opacity = 1;
    } else if (event.playerState === 'IDLE') {
        overlay.textContent = 'Ready';
        overlay.style.opacity = 1;
    }
});

/**
 * Handles custom messages received from the sender.
 */
castReceiverContext.addCustomMessageListener('urn:x-cast:com.example.custom', (customEvent) => {
    console.log('Custom Message Received:', customEvent);
    // Process your custom messages here
    overlay.textContent = `Custom Message: ${customEvent.data.message}`;
    overlay.style.opacity = 1;
    setTimeout(() => {
        overlay.style.opacity = 0;
    }, 3000);
});

/**
 * Starts the receiver context.
 */
castReceiverContext.start();

console.log('Receiver app started');
