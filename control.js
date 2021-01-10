
(function($){
    $.fn.extend({
        address: function(options) {
            let defaults = {
                type: "province",
                province: {
                    name: "province",
                    class: "",
                },
            };
            options = $.extend(defaults, options);

            let rootDiv = $(this);
            let addressSelector = new AddressSelector();

            if(options.type == "province") {
                let selectDiv = `
                    <select name="${options.province.name}" class="${options.province.class}" id="${addressSelector.init.provinceSelectId}"></select>
                `
                rootDiv.append(selectDiv);
                addressSelector.renderProvince();
            } else if (options.type == "district") {
                if(options.province && options.district) {
                    let selectDiv = `
                        <select name="${options.province.name}" class="${options.province.class}" id="${addressSelector.init.provinceSelectId}"></select>
                        <select name="${options.district.name}" class="${options.district.class}" id="${addressSelector.init.districtSelectId}"></select>
                    `
                    rootDiv.append(selectDiv);
                    addressSelector.renderProvince();
                    addressSelector.renderDistrict();

                    $('#' + addressSelector.init.provinceSelectId).change(function(){
                        let id = $(this).find('option:selected').data('id');
                        addressSelector.renderDistrict(id);
                    })
                } else {
                    console.error("AddressSelector: Option invalid!")
                }
            } else if (options.type == "ward") {
                if(options.province && options.district && options.ward) {
                    let selectDiv = `
                    <select name="${options.province.name}" class="${options.province.class}" id="${addressSelector.init.provinceSelectId}"></select>
                    <select name="${options.district.name}" class="${options.district.class}" id="${addressSelector.init.districtSelectId}"></select>
                    <select name="${options.ward.name}" class="${options.ward.class}" id="${addressSelector.init.wardSelectId}"></select>
                `
                    rootDiv.append(selectDiv);

                    addressSelector.renderProvince();
                    addressSelector.renderDistrict();
                    addressSelector.renderWard();

                    $('#' + addressSelector.init.provinceSelectId).change(function(){
                        let id = $(this).find('option:selected').data('id');
                        addressSelector.renderDistrict(id, 1);
                    })
                    $('#' + addressSelector.init.districtSelectId).change(function(){
                        let id = $(this).find('option:selected').data('id');
                        addressSelector.renderWard(id);
                    })
                } else {
                    console.error("AddressSelector: Option invalid!")
                }
            }
        }
    });
})(jQuery);

function AddressSelector() {
    this.api = 'http://localhost:3000/api/v1/'
    this.init = {
        provinceSelectId: 'ZMlyt-b6tvq',
        districtSelectId: 'cxxav-QWrol',
        wardSelectId: 'Kc7Kd-8njkJ'
    }
}

AddressSelector.prototype.renderProvince = function() {
    let provinceId = this.init.provinceSelectId;
    $.get(this.api + 'provinces', function(response){
        $('#' + provinceId).append("<option value='' selected>---Chọn tỉnh/thành phố---</option>");
        response.forEach((item) => {
            $('#' + provinceId).append("<option value='" + item._name + "' data-id='"+ item.id +"'>" + (item._prefix ?? "")  + " " + item._name + "</option>");
        });
    });
}

AddressSelector.prototype.renderWard = function(districtId = 1) {
    let wardId = this.init.wardSelectId;
    $('#' + wardId).find('option').remove().end();
    $.get(this.api + 'wards/' + districtId, function(response){
        $('#' + wardId).append("<option value='' selected>---Chọn xã/phường---</option>");
        response.forEach((item) => {
            $('#' + wardId).append("<option value='" + item._name + "' data-id='"+ item.id +"'>" + (item._prefix ?? "")  + " " + item._name + "</option>");
        });
    });
}

AddressSelector.prototype.renderDistrict = function(provinceId = 1, renderWithWard = 0) {
    let districtId = this.init.districtSelectId;
    $('#' + districtId).find('option').remove().end();
    $.ajaxSetup({async: false});
    $.get(this.api + 'districts/' + provinceId, function(response){
        $('#' + districtId).append("<option value='' selected>---Chọn quận/huyện---</option>");
        response.forEach((item) => {
            $('#' + districtId).append('<option value="' + item._name + '" data-id="'+ item.id +'">' + (item._prefix ?? "")  + " " + item._name + "</option>");
        });
    });
    if(renderWithWard) {
        let id = $('#' + districtId).find('option:nth-child(2)').data('id');
        this.renderWard(id);
    }
}