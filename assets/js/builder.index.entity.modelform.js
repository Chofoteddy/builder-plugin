/*
 * Builder Index controller Model Form entity controller
 */
+function ($) { "use strict";

    if ($.oc.builder === undefined)
        $.oc.builder = {}

    if ($.oc.builder.entityControllers === undefined)
        $.oc.builder.entityControllers = {}

    var Base = $.oc.builder.entityControllers.base,
        BaseProto = Base.prototype

    var ModelForm = function(indexController) {
        Base.call(this, 'modelForm', indexController)
    }

    ModelForm.prototype = Object.create(BaseProto)
    ModelForm.prototype.constructor = ModelForm

    // PUBLIC METHODS
    // ============================

    ModelForm.prototype.cmdCreateForm = function(ev) {
        var $link = $(ev.currentTarget),
            data = {
                model_class: $link.data('modelClass')
            }

        this.indexController.openOrLoadMasterTab($link, 'onModelFormCreateOrOpen', this.newTabId(), data)
    }

    ModelForm.prototype.cmdSaveForm = function(ev) {
        var $form = $(ev.currentTarget).closest('form'),
            $rootContainer = $('[data-root-control-wrapper] > [data-contol-container]', $form), 
            data = {
                controls: $.oc.builder.formbuilder.domToPropertyJson.convert($rootContainer.get(0))
            }

        $.oc.stripeLoadIndicator.show()
        $form.request('onModelFormSave', {
            data: data
        }).always(
            $.oc.builder.indexController.hideStripeIndicatorProxy
        ).done(
            this.proxy(this.saveFormDone)
        )
    }

    // INTERNAL METHODS
    // ============================

    ModelForm.prototype.saveFormDone = function(data) {
        if (data['builderRepsonseData'] === undefined) {
            throw new Error('Invalid response data')
        }

        var $masterTabPane = this.getMasterTabsActivePane()

        $masterTabPane.find('input[name=file_name]').val(data.builderRepsonseData.builderObjectName)
        this.updateMasterTabIdAndTitle($masterTabPane, data.builderRepsonseData)
        this.unhideFormDeleteButton($masterTabPane)

// this.getTableList().fileList('markActive', data.builderRepsonseData.tabId)
        this.getIndexController().unchageTab($masterTabPane)
     
    }

    // REGISTRATION
    // ============================

    $.oc.builder.entityControllers.modelForm = ModelForm;

}(window.jQuery);