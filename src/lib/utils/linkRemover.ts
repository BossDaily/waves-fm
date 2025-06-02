/**
 * Utility to continuously monitor and remove anchor tags with specific href
 */

class LinkRemover {
    private observer: MutationObserver | null = null;
    private intervalId: number | null = null;
    private targetHref: string;

    constructor(targetHref: string = "https://neat.firecms.co") {
        this.targetHref = targetHref;
    }

    /**
     * Remove all existing links with the target href
     */
    private removeExistingLinks(): void {
        const links = document.querySelectorAll(`a[href="${this.targetHref}"]`);
        links.forEach(link => {
            console.log(`🗑️ Removing unwanted link: ${this.targetHref}`);
            link.remove();
        });
    }

    /**
     * Start monitoring for new links and remove them
     */
    start(): void {
        // Remove any existing links immediately
        this.removeExistingLinks();

        // Set up MutationObserver to watch for DOM changes
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node as Element;
                            
                            // Check if the added node itself is the target link
                            if (element.tagName === 'A' && element.getAttribute('href') === this.targetHref) {
                                console.log(`🗑️ Removing newly added unwanted link: ${this.targetHref}`);
                                element.remove();
                                return;
                            }

                            // Check if any child elements are target links
                            const childLinks = element.querySelectorAll(`a[href="${this.targetHref}"]`);
                            childLinks.forEach(link => {
                                console.log(`🗑️ Removing unwanted child link: ${this.targetHref}`);
                                link.remove();
                            });
                        }
                    });
                }
            });
        });

        // Start observing the document body for changes
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });

        // Also run a periodic check every 5 seconds as a fallback
        this.intervalId = window.setInterval(() => {
            this.removeExistingLinks();
        }, 5000);

        console.log(`🛡️ Link remover started, monitoring for: ${this.targetHref}`);
    }

    /**
     * Stop monitoring and cleanup
     */
    stop(): void {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        console.log(`🛑 Link remover stopped for: ${this.targetHref}`);
    }

    /**
     * Change the target href to monitor
     */
    setTargetHref(newHref: string): void {
        this.targetHref = newHref;
        if (this.observer) {
            // Restart with new target
            this.stop();
            this.start();
        }
    }
}

// Export a singleton instance
export const linkRemover = new LinkRemover();

// Export the class for custom instances
export { LinkRemover };
