<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Explorador del Sistema Solar 3D</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            overflow: hidden;
        }
        #solar-system-canvas {
            width: 100%;
            height: 100%;
            display: block;
            background-color: #000;
        }
        #planet-list-panel {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        #planet-list-panel::-webkit-scrollbar {
            display: none;
        }
    </style>
</head>
<body class="bg-gray-900 text-white">
    <div class="flex flex-col md:flex-row h-screen">
        <div id="planet-list-panel" class="w-full md:w-1/4 p-4 overflow-y-auto bg-gray-800 rounded-lg shadow-lg m-2 flex-shrink-0">
            <h2 class="text-2xl font-bold mb-4 text-center text-blue-400">Explorador Solar</h2>
            <ul id="planet-list" class="space-y-2"></ul>
        </div>
        <div class="flex-1 flex flex-col items-center justify-center relative">
            <canvas id="solar-system-canvas" class="w-full h-full rounded-lg shadow-lg m-2"></canvas>
            <div id="loading-spinner" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-75 z-50">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p class="mt-4 text-lg text-blue-300">Cargando sistema solar...</p>
            </div>
            <div id="planet-info-panel" class="absolute bottom-4 left-4 right-4 bg-gray-800 p-4 rounded-xl shadow-2xl hidden md:block border border-gray-700">
                <h3 id="planet-name" class="text-3xl font-extrabold mb-2 text-yellow-300"></h3>
                <p id="planet-description" class="text-base mb-3 text-gray-300"></p>
                <p id="planet-details" class="text-sm text-gray-400"></p>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js"></script>
    <script>
        // El script JavaScript completo está en la página Canvas
    </script>
</body>
</html>
