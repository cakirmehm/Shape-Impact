export default class InputHandler {
    constructor() {
        this.keys = new Set();
        this.touchX = '';
        this.touchY = '';
        this.threshold = 30;

        window.addEventListener('keydown', e => {
            if (
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowDown' ||
                e.key === ' '
            )
                this.keys.add(e.key);
        });

        window.addEventListener('keyup', e => {
            if (
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowDown' ||
                e.key === ' '
            )
                this.keys.delete(e.key);
        });

        window.addEventListener('touchstart', e => {
            this.touchX = e.changedTouches[0].pageX;
            this.touchY = e.changedTouches[0].pageY;
            this.keys.add('swipe touched');
        });

        window.addEventListener('touchmove', e => {
            const swipeChangeX = e.changedTouches[0].pageX - this.touchX;
            const swipeChangeY = e.changedTouches[0].pageY - this.touchY;

            if (swipeChangeY < -this.threshold) this.keys.add('swipe up');
            else if (swipeChangeY > this.threshold) this.keys.add('swipe down');

            if (swipeChangeX < -this.threshold) this.keys.add('swipe left');
            else if (swipeChangeX > this.threshold)
                this.keys.add('swipe right');

            // console.log(this.keys);
        });

        window.addEventListener('touchend', e => {
            this.keys.clear();
        });
    }
}
