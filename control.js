(function($){
    $.fn.extend({
        address: function(options) {
            const api = 'https://vn-address-api.herokuapp.com/api/v1/';
            const initData = {
                provinceSelectId: makeid(8),
                districtSelectId: makeid(8),
                wardSelectId: makeid(8)
            }

            let defaults = {
                type: "province",
                province: {
                    name: "province",
                    class: "",
                },
            };
            options = $.extend(defaults, options);

            if(options.type == "province") {
                if(options.province) {
                    let selectDiv = `
                        <div class="${options.province.parentDivClass}">
                            ${options.province.label ? `<label>${options.province.label}</label>` : ""}
                            <select name="${options.province.name}" class="${options.province.class}" id="${initData.provinceSelectId}"></select>
                        </div>
                    `
                    $(this).append(selectDiv);
                    $.get(api + 'provinces', function(response){ 
                        if (response != null) {
                            renderOption('province', initData.provinceSelectId, response);
                        } else {
                            console.error("AddressSelector: Get data error!")
                        }
                    });   
                } else {
                    console.error("AddressSelector: Custom option invalid!")
                }
            } else if (options.type == "district") {
                if(options.province && options.district) {
                    let selectDiv = `
                        <div class="${options.province.parentDivClass}">
                            ${options.province.label ? `<label>${options.province.label}</label>` : ""}
                            <select name="${options.province.name}" class="${options.province.class}" id="${initData.provinceSelectId}"></select>
                        </div>
                        <div class="${options.district.parentDivClass}">
                            ${options.district.label ? `<label>${options.district.label}</label>` : ""}
                            <select name="${options.district.name}" class="${options.district.class}" id="${initData.districtSelectId}" disabled></select>
                        </div>
                    `
                    $(this).append(selectDiv);
                    $.get(api + 'provinces', function(response){ 
                        if (response != null) {
                            renderOption('province', initData.provinceSelectId, response);
                        } else {
                            console.error("AddressSelector: Get data error!")
                        }
                    });  
                    clearOption('district', initData.districtSelectId);

                    $('#' + initData.provinceSelectId).change(function(){
                        let id = $(this).find('option:selected').data('id');
                        if(id != undefined) {
                            $('#' + initData.districtSelectId).find('option').remove().end();
                            $('#' + initData.districtSelectId).removeAttr("disabled");
                            $.get(api + 'districts/' + id, function(response){ 
                                if (response != null) {
                                    renderOption('district', initData.districtSelectId, response);
                                } else {
                                    console.error("AddressSelector: Get data error!")
                                }
                            });  
                        } else {
                            clearOption('district', initData.districtSelectId);
                        }
                    })
                } else {
                    console.error("AddressSelector: Custom option invalid!")
                }
            } else if (options.type == "ward") {
                if(options.province && options.district && options.ward) {
                    let selectDiv = `
                        <div class="${options.province.parentDivClass}">
                            ${options.province.label ? `<label>${options.province.label}</label>` : ""}
                            <select name="${options.province.name}" class="${options.province.class}" id="${initData.provinceSelectId}"></select>
                        </div>
                        <div class="${options.district.parentDivClass}">
                            ${options.district.label ? `<label>${options.district.label}</label>` : ""}
                            <select name="${options.district.name}" class="${options.district.class}" id="${initData.districtSelectId}"></select>
                        </div>
                        <div class="${options.ward.parentDivClass}">
                            ${options.ward.label ? `<label>${options.ward.label}</label>` : ""}
                            <select name="${options.ward.name}" class="${options.ward.class}" id="${initData.wardSelectId}"></select>
                        </div>
                    `
                    $(this).append(selectDiv);

                    $.get(api + 'provinces', function(response){ 
                        if (response != null) {
                            renderOption('province', initData.provinceSelectId, response);
                        } else {
                            console.error("AddressSelector: Get data error!")
                        }
                    });  
                    clearOption('district', initData.districtSelectId);
                    clearOption('ward', initData.wardSelectId);

                    $('#' + initData.provinceSelectId).change(function(){
                        let id = $(this).find('option:selected').data('id');
                        if(id != undefined) {
                            $('#' + initData.districtSelectId).find('option').remove().end();
                            $('#' + initData.districtSelectId).removeAttr("disabled");
                            $.get(api + 'districts/' + id, function(response){ 
                                if (response != null) {
                                    renderOption('district', initData.districtSelectId, response);
                                } else {
                                    console.error("AddressSelector: Get data error!")
                                }
                            });  
                        } else {
                            clearOption('district', initData.districtSelectId);
                            clearOption('ward', initData.wardSelectId);
                        }
                    })

                    $('#' + initData.districtSelectId).change(function(){
                        let id = $(this).find('option:selected').data('id');
                        if(id != undefined) {
                            $('#' + initData.wardSelectId).find('option').remove().end();
                            $('#' + initData.wardSelectId).removeAttr("disabled");
                            $.get(api + 'wards/' + id, function(response){ 
                                if (response != null) {
                                    renderOption('ward', initData.wardSelectId, response);
                                } else {
                                    console.error("AddressSelector: Get data error!")
                                }
                            });  
                        } else {
                            clearOption('ward', initData.wardSelectId);
                        }
                    })
                } else {
                    console.error("AddressSelector: Option invalid!")
                }
            }
        }
    });
})(jQuery);

function renderOption(type, id, data) {
    if(type == 'province') {
        $('#' + id).append("<option value='' selected>---Chọn tỉnh/thành phố---</option>");
    } else if (type == 'district') {
        $('#' + id).append("<option value='' selected>---Chọn quận/huyện---</option>");
    } else if (type == 'ward') {
        $('#' + id).append("<option value='' selected>---Chọn xã/phường---</option>");
    }
    data.forEach((item) => {
        let displayName = item._prefix ? item._prefix  + " " + item._name : item._name;
        $('#' + id).append("<option value='" + displayName + "' data-id='"+ item.id +"'>" + displayName + "</option>");
    });
}

function clearOption(type, id) {
    $('#' + id).prop("disabled", true);
    $('#' + id).find('option').remove().end();
    if(type == 'province') {
        $('#' + id).append("<option value='' selected>---Chọn tỉnh/thành phố---</option>");
    } else if (type == 'district') {
        $('#' + id).append("<option value='' selected>---Chọn quận/huyện---</option>");
    } else if (type == 'ward') {
        $('#' + id).append("<option value='' selected>---Chọn xã/phường---</option>");
    }
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
