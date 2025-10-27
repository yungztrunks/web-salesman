var TSP = {
    
    init: function() {
        this.setupEventHandlers();
    },

    setupEventHandlers: function() {
        var self = this;

        $("#loadTspBtn").click(function() {
            $("#tspLoadPanel").slideToggle(200);
            $("#tspTextArea").val('');
        });

        $("#cancelTspLoad").click(function() {
            $("#tspLoadPanel").slideUp(200);
        });

        $("#loadTspData").click(function() {
            self.loadTspData();
        });
    },

    showNotification: function(message, duration) {
        var notification = $("#loadNotification");
        notification.text(message);
        notification.fadeIn(200);
        setTimeout(function() {
            notification.fadeOut(200);
        }, duration || 3000);
    },

    loadTspData: function() {
        var tspContent = $("#tspTextArea").val();
        if (tspContent.trim() === '') {
            this.showNotification('Please paste TSP content.', 2000);
            return;
        }

        try {
            var parsedPoints = this.parseTspFile(tspContent);
            if (parsedPoints.length === 0) {
                this.showNotification('No valid coordinates found in TSP file.', 2000);
                return;
            }

            if (typeof stop === 'function') {
                stop();
            }
            
            results = [];
            if (typeof plot === 'function') {
                plot(results);
            }
            clearCanvas();

            points = this.scalePointsToCanvas(parsedPoints);
            drawPoints(points);

            $("#tspLoadPanel").slideUp(200);
            this.showNotification('Loaded ' + points.length + ' points successfully!', 2500);
        } catch (error) {
            this.showNotification('Error parsing TSP file: ' + error.message, 3000);
        }
    },

    parseTspFile: function(content) {
        var lines = content.split('\n');
        var coordinates = [];
        var inCoordSection = false;

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();

            if (line === 'NODE_COORD_SECTION') {
                inCoordSection = true;
                continue;
            }

            if (line === 'EOF' || line === 'EDGE_WEIGHT_SECTION' || line === 'DISPLAY_DATA_SECTION') {
                break;
            }

            if (inCoordSection && line !== '') {
                var parts = line.split(/\s+/);
                if (parts.length >= 3) {
                    var x = parseFloat(parts[1]);
                    var y = parseFloat(parts[2]);
                    if (!isNaN(x) && !isNaN(y)) {
                        coordinates.push({x: x, y: y});
                    }
                }
            }
        }

        return coordinates;
    },

    scalePointsToCanvas: function(points) {
        if (points.length === 0) return [];

        var minX = points[0].x, maxX = points[0].x;
        var minY = points[0].y, maxY = points[0].y;

        for (var i = 0; i < points.length; i++) {
            if (points[i].x < minX) minX = points[i].x;
            if (points[i].x > maxX) maxX = points[i].x;
            if (points[i].y < minY) minY = points[i].y;
            if (points[i].y > maxY) maxY = points[i].y;
        }

        var padding = 20;
        var canvasWidth = c.width - 2 * padding;
        var canvasHeight = c.height - 2 * padding;
        
        var rangeX = maxX - minX;
        var rangeY = maxY - minY;

        var scaleX = rangeX > 0 ? canvasWidth / rangeX : 1;
        var scaleY = rangeY > 0 ? canvasHeight / rangeY : 1;
        
        var scale = Math.min(scaleX, scaleY);

        var scaledPoints = [];
        for (var i = 0; i < points.length; i++) {
            var scaledX = (points[i].x - minX) * scale + padding;
            var scaledY = (points[i].y - minY) * scale + padding;
            scaledPoints.push({x: scaledX, y: scaledY});
        }

        return scaledPoints;
    }

};
