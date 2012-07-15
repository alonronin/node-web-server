var port_scanner = require('portscanner'),
    spawn = require('child_process').spawn,
    httpProxy = require('http-proxy');

var port_range = [3000, 4000],
    host = 'localhost',
    sites = [],
    i = 0;

sites.push({'address' : 'test1.roninil.com', 'path' : 'c://www/test1/app.js'});
sites.push({'address' : 'test2.roninil.com', 'path' : 'c://www/test2/app.js'});
sites.push({'address' : 'webic.roninil.com', 'path' : 'c://www/Webic-CMAss/app.js'});
sites.push({'address' : 'chat.roninil.com', 'path' : 'c://www/chat/app.js'});

var launch = function(){
    if(i < sites.length){
        port_scanner.findAPortNotInUse(port_range[0], port_range[1], host, function(err, port){
            var env = {};
            env.PORT = port;

            var child = spawn('node', [sites[i].path], {env: env});

            child.on('exit', function(code){
                console.error('http://%s:%d -- stopped with code %d', host, port, code);
            });

            console.log('http://%s:%d -- starting', host, port);

            setTimeout(function(){
                port_scanner.checkPortStatus(port, host, function(err, status){
                    if(status == 'open') {
                        sites[i].port = port;
                        console.log('http://%s:%d -- started', host, port);
                        i++;
                        launch();
                    }else{
                        console.error("can't start server");
                        console.log(arguments);
                    }
                })
            }, 800);
        });
    }else{
        var options = {
            router: {}
        };

        sites.forEach(function(site){
            options.router[site.address] = host + ':' + site.port;
        });

        console.log(options);

        httpProxy.createServer(options).listen(80);
    }
};

launch();













