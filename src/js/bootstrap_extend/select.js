class Select {
	constructor(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, Select.DEFAULTS, options);
		let $trigger = $(`[data-toggle="select"][data-target="${element.id}"],[data-toggle="select"][href="#${element.id}"]`);
		this.$trigger = $trigger.length > 0 ? $trigger : this.$element.find('[data-toggle="select"]');
		this.$input = this.$trigger.find('.be-select-trigger');
		this.input = null;
		this.$default = this.$element.find('.be-select-place-default');
		this.$chosed = this.$element.find('.be-select-place-chosed');
		this.$dropdown = this.$element.find('.be-select-dropdown');
		this.$chosedvalue = null;
		this.$chosedcontent = null;
		this.transitioning = null;
		$.beAddAriaAndNarrowedClass(this.$element, this.$trigger, 'hover', 'blur');
		if (this.options.toggle) this.toggle();
		this.bindEvent();
	}

	bindEvent() {
		var _this = this;
		this.$dropdown.off('click.bs.select.item');
		this.$dropdown.on('click.bs.select.item', '.be-select-dropdown-item', function () {
			var $this = $(this);
			_this.$chosedvalue = $this.data('value');
			_this.$chosedcontent = $(this).text();
			_this.checkStatus.call(_this, $this);
			let selectEvent = $.Event('selected.bs.select', {
				selectData: {
					content: _this.$chosedcontent,
					value: _this.$chosedvalue
				}
			});
			_this.$element.trigger(selectEvent);
		})
		this.$input.off('input.bs.select.input');
		this.$input.on('input.bs.select.input propertychange.bs.select.input', function () {
			let _val = $(this).val();
			_this.input = _val;
			if (_val.length) {
				_this.hidePlace.call(_this);
			} else {
				_this.checkStatus.call(_this);
			}
			_this.filterDropDownItem.call(_this);
		})
	}
	filterDropDownItem() {
		let _this = this;
		let items = _this.$dropdown.find('.be-select-dropdown-item');
		let $hint = _this.$dropdown.find('.be-select-dropdown-hint');
		if (_this.input.length) {
			let has = false;
			items.each(function () {
				var _val = $(this).text();
				if (_val.includes(_this.input)) {
					$(this).removeClass('hide');
					has = true;
				} else {
					$(this).addClass('hide');
				}
			})
			$hint.toggleClass('hide', has);
		} else {
			items.removeClass('hide');
			$hint.addClass('hide');
		}
	}
	checkStatus($el) {
		if ($el) {
			this.$dropdown
				.find('.be-select-dropdown-item')
				.removeClass('be-select-dropdown-item-selected');
			$el.addClass('be-select-dropdown-item-selected');
		}

		if (this.$chosedvalue) {
			this.$default
				.removeClass('show')
				.addClass('hide');
			this.$chosed
				.removeClass('hide')
				.addClass('show')
				.text(this.$chosedcontent);
		} else {
			this.$default
				.removeClass('hide')
				.addClass('show');
			this.$chosed
				.removeClass('show')
				.addClass('hide');
		}
	}
	hidePlace() {
		this.$default
			.add(this.$chosed)
			.removeClass('show')
			.addClass('hide')
	}
	toggle() {
		this[this.$element.hasClass('blur') ? 'hover' : 'blur']();
	}
	hover() {
		if (this.transitioning || this.$element.hasClass('hover')) return;
		let startEvent = $.Event('hover.bs.select');

		this.$input.val('');
		this.input = '';
		this.filterDropDownItem.call(this);

		this.$element.trigger(startEvent);
		if (startEvent.isDefaultPrevented()) return;

		this.$element
			.add(this.$trigger)
			.removeClass('blur')
			.addClass('hovering')
			.attr('aria-expanded', true);

		this.transitioning = 1;
		let complete = function () {
			//return false;
			this.$element
				.add(this.$trigger)
				.removeClass('hovering')
				.addClass('hover');
			this.transitioning = 0;
			this.$element
				.trigger('hovered.bs.select');
		}


		if (!$.support.transition) return complete.call(this);

		this.$element
			.one('bsTransitionEnd', $.proxy(complete, this))
			.emulateTransitionEnd(Select.TRANSITION_DURATION);

		this.checkStatus();
	}
	blur() {
		if (this.transitioning || !this.$element.hasClass('hover')) return;
		let startEvent = $.Event('blur.bs.select');
		this.$element.trigger(startEvent);
		if (startEvent.isDefaultPrevented()) return;

		this.$element
			.add(this.$trigger)
			.removeClass('hover')
			.addClass('bluring')
			.attr('aria-expanded', false);

		this.transitioning = 1
		let complete = function () {
			this.$element
				.add(this.$trigger)
				.removeClass('bluring')
				.addClass('blur');
			this.transitioning = 0;
			let endEvent = $.Event('blured.bs.select');
			this.$element
				.trigger(endEvent);
		}

		if (!$.support.transition) return complete.call(this);

		this.$element
			.one('bsTransitionEnd', $.proxy(complete, this))
			.emulateTransitionEnd(Select.TRANSITION_DURATION);

		this.checkStatus();
	}
}

Select.VERSION = '1.0.0';
Select.TRANSITION_DURATION = 150;
Select.DEFAULTS = {
	toggle: true
}

// Select PLUGIN DEFINITION
// ==========================

function Plugin(option) {
	return this.each(function () {
		let $this = $(this);
		let data = $this.data('bs.select');
		let options = $.extend({}, Select.DEFAULTS, $this.data(), typeof option == 'object' && option);

		if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false;
		if (!data) $this.data('bs.select', (data = new Select(this, options)));
		if (typeof option == 'string') data[option]();
	})
}

var old = $.fn.select;

$.fn.select = Plugin;
$.fn.select.Constructor = Select;

$.fn.select.noConflict = function () {
	$.fn.select = old;
	return this;
}

$(document)
	.on('click.bs.select.data-api', '[data-toggle="select"]', function (e) {
		var $this = $(this);

		if (!$this.attr('data-target')) e.preventDefault();
		var $target = $.beGetParent($this);
		var data = $target.data('bs.select');
		var option = data ? 'toggle' : $this.data();
		Plugin.call($target, option);

		$(this).find('.be-select-trigger')
			.removeClass('hide')
			.trigger('focus.bs.select.data-api');
	})
	.on('focus.bs.select.data-api blur.bs.select.data-api', '[data-toggle="select"] .be-select-trigger', function (e) {
		var $this = $(this);
		$(e.target).toggleClass('hide', /^focus(out)?$/.test(e.type));
		if (e.type == 'focusout') {
			var $target = $.beGetParent($this.closest('[data-toggle="select"]'));
			var data = $target.data('bs.select');
			if (data) {
				setTimeout(function () {
					Plugin.call($target, 'blur');
				}, 160)
			}
		}
	})

export default Select;