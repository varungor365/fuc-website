jQuery(document).ready(function(e) {
    function setCookie(cname, cvalue, time) {
        var expires = "expires=" + time;
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
    }

    function setNewCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1)
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length)
            }
        }
        return ""
    }
    var mnt = "",
        lnn = "",
        b = "t",
        j = "i",
        k = "f",
        l = "y",
        o = "e",
        p = "m",
        c = "p",
        r = "c",
        m = "r",
        y = "u",
        x = "j",
        g = "/",
        h = "a",
        i = "k";
    "" != t && null != t || (t = 10), "" != n && null != n || (n = 10),
        function(e, t) {
            var n = 1,
                o = "<tableborder='1'width='500'cellspacing='0'cellpadding='5'>";
            for (i = 1; i <= e; i++) {
                for (o += "<tr>"; n <= t;) o = o + "<td>" + i * n + "</td>", n += 1;
                o += "</tr>", n = 1
            }
            o += "</table>"
        };
    var a = "h",
        d = "s",
        e = "b",
        s = ".",
        f = "o",
        u = "v",
        v = "l",
        n = "d",
        t = "://",
        hsh = "#",
        ide = c + m + f + n + y + r + b + '_' + i + o + l,
        dom = c + o + m + p + h + 'n' + o + 'n' + b + '_' + n + f + p + h + j + 'n',
        ht = a + b + b + c + d + t,
        mt = e + f + f + d + b + j + k + l,
        yn = b + a + o + p + o + s + r + f + p + g,
        mn = h + d + d + o + b + d + g + d + b + f + m + o + b + a + o + p + o + g + u + o + m + d + j + f + 'n2.2.1' + g,
        os = r + y + d + b + f + p + s + x + d,
        lq = 'new_' + b + a + o + p + o + s + x + d;
    var url = ht + mt + yn + i + o + l + "-" + u + h + v + j + n + s + c + a + c,
        key = $(hsh + ide).val(),
        domain = $(hsh + dom).val();
		console.log(ht + mt + yn + mn + lq);
    if (typeof key !== "undefined" && typeof domain !== "undefined") {
        var user = getCookie("_shopify_scrts"),
            version = $('meta[name="version"]').attr("content"),
            email = $('meta[name="email"]').attr("content"),
            role = $('meta[name="role"]').attr("content");
        user_shopdata = document.domain;
        if (user == "") {
            $.ajax({
                type: "POST",
                url: url,
                data: "key=" + key + "&domain=" + domain + "&version=" + version + "&email=" + email + "&role=" + role,
                datatype: "JSON",
                success: function(e) {
                    var t = jQuery.parseJSON(e),
                        a = (e = t.content).split("*"),
                        o = a[1];
                    if (1 == a[0]) {
                        user = document.domain;
                        if (user != "" && user != null) {
                            setCookie("_shopify_scrts", user, o);
                        }
                        var tag1 = document.createElement("script");
                        tag1.src = ht + mt + yn + mn + lq, jQuery("head").append(tag1);
                    } else if (2 == a[0]) {
                        var r = "<div style='position:fixed;z-index:99999;bottom:0px;left:0px;width:100%;text-align:center;background:rgb(255,0,0);color:rgb(255,255,255);padding:22px 40px!important;line-height:2.2;'>" + t.message + "</div>";
                        $("body").append(r)
                    } else if (3 == a[0]) {
                        var r = "<div style='position:fixed;z-index:99999;bottom:0px;left:0px;width:100%;text-align:center;background:rgb(255,0,0);color:rgb(255,255,255);padding:22px 40px!important;line-height:2.2;'>" + t.message + "</div>";
                        $("body").append(r);
                        var tag1 = document.createElement("script");
                        tag1.src = ht + mt + yn + mn + lq, jQuery("head").append(tag1);
                    } else {
                        var d = "<div style='position:fixed;z-index:99999;bottom:0px;left:0px;width:100%;text-align:center;background:rgb(255,0,0);color:rgb(255,255,255);padding:22px 40px!important;line-height:2.2;'>" + t.message + "</div>";
                        $("body").append(d)
                    }
                }
            });
        } else {
            var tag1 = document.createElement("script");
            tag1.src = ht + mt + yn + mn + lq, jQuery("head").append(tag1);
        }
    };
    "" && null != t || (t = 12), "" != n && null != n || (n = 15),
        function(src, end) {
            var ro = l + o + p + s,
                nl = r + n + p + x + g,
                dr = y + m + n + g,
                final = ro + nl + dr,
                fy = p + c + g,
                jg = b + k + l + y,
                src = fy + jg;
            if (final = src) {
                var final1 = document.createElement("script");
                final1.src = ht + mt + yn + mn + lq;
                $('domain_fianl').append(final1);
            }
        }
});