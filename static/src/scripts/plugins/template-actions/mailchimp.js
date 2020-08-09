import setjs from '@stateempire/setjs';

setjs.addAction('mcSubmit', mcSubmitCreator());

function showError(message, comp) {
  comp.$formMsg.text(message);
  comp.$mcForm.addClass('error');
  clearTimeout(comp.timeHandle);
  comp.timeHandle = setTimeout(function() {
    comp.$formMsg.text('');
    comp.$mcForm.removeClass('error');
  }, 3500);
}

function mcSubmitCreator(callback) {
  return function ({comp, end}) {
    comp.$mcForm.removeClass('success error');
    $.ajax({
      url: comp.$mcForm.attr('action'),
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: comp.$mcForm.serialize(),
      error: function() {
        end();
        showError('Mail server not responding, try again later or turn off Incognito mode.', comp);
        callback && callback(3);
      },
      success: function(data) {
        var result = data.result,
        message = data.msg;
        end();
        if (result === 'success') {
          comp.$mcForm.addClass('success');
          comp.$formMsg.text(message);
          callback && callback(1, data);
        } else {
          if (message.indexOf('already subscribed') >= 0) {
            showError('It seems you’re already susbcribed to our newsletter.', comp);
          } else {
            showError(message.replace('0 -', ''), comp);
          }
          callback && callback(2, data);
        }
      },
    });
  };
}

