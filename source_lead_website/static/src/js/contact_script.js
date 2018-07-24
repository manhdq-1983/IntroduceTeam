odoo.define('source_lead_website.contact_xml', function (require) {
    'use strict';
    var ajax = require('web.ajax');
    require("web.dom_ready");
    var $body = $('body');
    //click collect form
    $body.off('click').on('click', '.contact-header', function () {
        var $formControl = $('#form_contact');
        var $close = $('.contact-close .fa');
        if ($formControl.hasClass('collect')) {
            $formControl.removeClass('collect');
            $formControl.css('bottom', $formControl.height() - 32);
            $close.addClass('fa-angle-down');
            $close.removeClass('fa-angle-up');

        } else {
            $formControl.addClass('collect');
            $close.addClass('fa-angle-up');
            $close.removeClass('fa-angle-down');
            $formControl.css('bottom', 0);
        }
    });

    var $envelope;
    var $modalForm;
    $body.on('mouseenter', '.envelope', function () {
        $envelope = $('.envelope');
        $envelope.removeClass('collect-envelope');
        $modalForm = $('#modal-form');
    });
    $body.on('mouseleave', '.envelope', function () {
        $envelope.addClass('collect-envelope');
    });

    $body.on('click', '.envelope', function () {
        $modalForm.modal('toggle');
        $('.dark-screen').removeClass('hidden');
    });
    $body.on('click', '#close_modal', function () {
        $modalForm.modal('toggle');
        $('.dark-screen').addClass('hidden');
    });
    $body.on('click', '.modal', function () {
        $('.dark-screen').addClass('hidden');
    });
    $body.on('click', '.modal-dialog', function (e) {
        e.stopPropagation();
    });


    //form question ajax
    $body.on('click', '.contact-footer #btn_send', function () {
        var name = null, phone = 0, address = null, email = null, question = null;
        var $name = $('.contact-body #contact_name');
        var $phone = $('.contact-body #contact_phone');
        var $email = $('.contact-body #contact_email');
        var $address = $('.contact-body #contact_address');
        var $question = $('.contact-body #contact_question');
        if ($name.val()) {
            name = $name.val();
        }
        if ($phone.val()) {
            phone = $phone.val();
        }
        if ($address.val()) {
            address = $address.val();
        }
        if ($email.val()) {
            email = $email.val();
        }
        if ($question.val()) {
            question = $question.val();
        }
        var checkemail = checkEmailSource(email);
        var checkphone = phoneNumberSource(phone);
        ajax.jsonRpc('/handling-form', 'call', {
            'kwargs': {
                'name': name,
                'phone': phone,
                'address': address,
                'email': email,
                'question': question,
                'checkemail': checkemail,
                'checkphone': checkphone
            }
        }).then(function (data) {
            if (data) {
                if (data['emailerror']) {
                    $email.addClass('error-question');
                } else {
                    $email.removeClass('error-question');
                }
                if (data['phoneerror']) {
                    $phone.addClass('error-question');
                } else {
                    $phone.removeClass('error-question');
                }
                if (data['success']) {
                    // turn off modal question turn on modal success
                    var $modalSuccess = $('#form_vertical').find('#modal-success');
                    $modalForm.modal('toggle');
                    $modalSuccess.modal('toggle');
                }
            }
        });
    });

});

//check email
function checkEmailSource(inputtxt) {
    var filter = /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/;
    return !!filter.test(inputtxt);
}

//check phone-number
function phoneNumberSource(inputtxt) {
    var phonenu = /^([(]?)?([+]?)?([0-9]{1,2})?([)]?)?([0-9]{9,10})$/;
    return !!phonenu.test(inputtxt);
}


