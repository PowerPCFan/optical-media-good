var windows = [
    {
        id: 'ie-window',
        title: 'Microsoft Internet Explorer',
        content: '<div style="margin: 0; padding: 0;">' +
            '<div style="padding: 4px; border-bottom: 1px solid #808080; background: #f0f0f0;">' +
                '<div style="display: flex; align-items: center; gap: 4px;">' +
                    '<button onclick="ieGoBack()" style="width: 28px; height: 28px; padding: 2px; display: flex; align-items: center; justify-content: center;">' +
                        '<img src="img/ie/back.png" style="width: 16px; height: 16px;">' +
                    '</button>' +
                    '<button onclick="ieGoForward()" style="width: 28px; height: 28px; padding: 2px; display: flex; align-items: center; justify-content: center;">' +
                        '<img src="img/ie/forward.png" style="width: 16px; height: 16px;">' +
                    '</button>' +
                    '<button onclick="ieStop()" style="width: 28px; height: 28px; padding: 2px; display: flex; align-items: center; justify-content: center;">' +
                        '<img src="img/ie/stop.png" style="width: 16px; height: 16px;">' +
                    '</button>' +
                    '<button onclick="ieRefresh()" style="width: 28px; height: 28px; padding: 2px; display: flex; align-items: center; justify-content: center;">' +
                        '<img src="img/ie/refresh.png" style="width: 16px; height: 16px;">' +
                    '</button>' +
                    '<button onclick="ieHome()" style="width: 28px; height: 28px; padding: 2px; display: flex; align-items: center; justify-content: center;">' +
                        '<img src="img/ie/home.png" style="width: 16px; height: 16px;">' +
                    '</button>' +
                    '<span style="margin: 0 8px;">Address</span>' +
                    '<input type="text" id="ie-address-bar" value="http://frogfind.com/" onkeypress="ieAddressKeyPress(event)" style="flex: 1; margin-right: 4px; height: 22px;">' +
                    '<button onclick="ieGo()" style="height: 26px; padding: 2px 8px; display: flex; align-items: center; gap: 4px;">' +
                        '<img src="img/ie/go.png" style="width: 16px; height: 16px;">' +
                        '<span>Go</span>' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<iframe id="ie-iframe" src="http://frogfind.com/" style="width: 100%; height: 400px; border: none; background: white;"></iframe>' +
        '</div>',
        icon: 'img/apps/ie6.png',
        taskbarText: 'Internet Explorer',
        width: '700px',
        height: '500px',
        initialX: 300,
        initialY: 250,
        active: false
    },
    {
        id: 'cmd-window',
        title: 'C:\\WINDOWS\\system32\\cmd.exe',
        content: '<pre style="width: 100%; height: 100%; box-sizing: border-box; padding-left: 8px !important; padding-right: 8px !important; padding-top: 0 !important; padding-bottom: 0 !important; display: block; white-space: pre-wrap !important; word-break: break-all !important; overflow-wrap: anywhere !important; word-wrap: break-word !important; hyphens: none !important; margin: 0;">' +
'Microsoft Windows XP [Version 5.1.2600]' +
'&#10094;C&#10095; Copyright 1985-2001 Microsoft Corp.' +
'<br>C:&#92;Documents and Settings&#92;Optical Media Good&#92;Website> type index.html&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '<h2 style="margin-top: 8px;" class="heading">Optical Media Good</h2>' +
'<br>C:&#92;Documents and Settings&#92;Optical Media Good&#92;Website><span id="blink">▋</span>' +
    '</pre>',
        icon: 'img/apps/cmd.png',
        taskbarText: 'Command Prompt',
        width: '575px',
        height: 'auto',
        initialX: 30,
        initialY: 30,
        active: true,
        style: 'background: black;'
    }
];


addEventCompat(document, 'DOMContentLoaded', function() {
    OpticalMediaGood.WindowManager.Init.initializeWindows();

    var timeElement = document.getElementById('time');
    var blink = document.getElementById('blink');
    
    setInterval(function() {
        OpticalMediaGood.Utils.updateTime(timeElement);
        if (blink) {
            blink.style.opacity = blink.style.opacity === '0' ? '1' : '0';
        }
    }, 1000);
});
