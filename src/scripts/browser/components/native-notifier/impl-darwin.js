import {Notification} from 'electron';
import BaseNativeNotifier from 'browser/components/native-notifier/base';

class DarwinNativeNotifier extends BaseNativeNotifier {

  constructor () {
    super();

    // Flag that this notifier has been implemented
    this.isImplemented = true;
  }

  fireNotification ({title, subtitle, body, tag = title, canReply, icon, onClick, onCreate}) {
    const identifier = (tag || title || '') + ':::' + Date.now();
    const notif = new Notification({
      title: title || global.manifest.productName,
      subtitle: subtitle || undefined,
      body: body || '',
      silent: false
    });

    const payload = {tag, identifier};

    notif.on('click', () => {
      this.emit('notif-activated-' + identifier, payload);
      this.emit('notif-activated', payload);
      if (typeof onClick === 'function') {
        onClick(payload);
      }
    });

    log('delivering notification', JSON.stringify(payload));
    notif.show();

    if (typeof onCreate === 'function') {
      onCreate(payload);
    }
  }

}

export default DarwinNativeNotifier;
