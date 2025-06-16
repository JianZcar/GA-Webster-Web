<!-- Hero -->
<section class="text-center py-20 px-6 shadow-md motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md">
  <div class="max-w-4xl mx-auto space-y-8">
    <h1 class="text-5xl font-extrabold">We are Bether</h1>

    <p class="text-lg leading-relaxed">
      This web application is part of our thesis research focused on enhancing <strong>Genetic Algorithms (GA)</strong> for traffic light signal optimization by integrating the <strong>Initial Webster’s Method</strong> during population seeding.
    </p>

    <p class="text-lg leading-relaxed">
      Our goal is to demonstrate that using our proposed method can lead to better and more efficient solutions in traffic signal timing. The platform supports this workflow with a <strong>visual road editor</strong>, <strong>custom XML editing</strong>, and tools for <strong>importing/exporting</strong> network data.
    </p>

    <p class="text-lg leading-relaxed">
      Simulations are run using <strong>SUMO</strong> (Simulation of Urban Mobility), executed within a <strong>GitHub Actions</strong> runner or similar CI/CD environment, providing automated performance evaluation and results tracking.
    </p>
  </div>
</section>

<!-- Team Section -->
<section class="max-w-5xl mx-auto py-12 px-4 motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md">
  <h2 class="text-2xl font-semibold text-center mb-10">Our Team</h2>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-8 justify-center">
    <a class="text-center" href="https://github.com/JovTim">
      <div class="w-30 h-30 rounded-full mx-auto shadow-md overflow-hidden relative">
        <div class="skeleton absolute inset-0"></div>
        <img
          x-data="{ loaded: false }"
          @load="loaded = true; setTimeout(() => $el.classList.replace('duration-200', 'duration-300'), 200)"
          :class="loaded ? 'opacity-100' : 'opacity-0'"
          src="https://github.com/JovTim.png"
          alt="Jovan"
          class="absolute inset-0 w-full h-full object-cover transition-all duration-200 hover:scale-125" />
      </div>
      <p class="mt-4 font-medium">Jovan Timosa</p>
    </a>

    <a class="text-center" href="https://github.com/JianZcar">
      <div class="w-30 h-30 rounded-full mx-auto shadow-md overflow-hidden relative">
        <div class="skeleton absolute inset-0"></div>
        <img
          x-data="{ loaded: false }"
          @load="loaded = true; setTimeout(() => $el.classList.replace('duration-200', 'duration-500'), 200)"
          :class="loaded ? 'opacity-100' : 'opacity-0'"
          src="https://github.com/JianZcar.png"
          alt="Jian"
          class="absolute inset-0 w-full h-full object-cover transition-all duration-200 hover:scale-125" />
      </div>
      <p class="mt-4 font-medium">Jian Zcar Esteban</p>
    </a>

    <a class="text-center" href="https://github.com/uzzielkyle">
      <div class="w-30 h-30 rounded-full mx-auto shadow-md overflow-hidden relative">
        <div class="skeleton absolute inset-0"></div>
        <img
          x-data="{ loaded: false }"
          @load="loaded = true; setTimeout(() => $el.classList.replace('duration-200', 'duration-500'), 200)"
          :class="loaded ? 'opacity-100' : 'opacity-0'"
          src="https://github.com/uzzielkyle.png"
          alt="Uzziel"
          class="absolute inset-0 w-full h-full object-cover transition-all duration-200 hover:scale-125" />
      </div>
      <p class="mt-4 font-medium">Uzziel Kyle Ynciong</p>
    </a>

    <a class="text-center" href="https://github.com/Carl2121">
      <div class="w-30 h-30 rounded-full mx-auto shadow-md overflow-hidden relative">
        <div class="skeleton absolute inset-0"></div>
        <img
          x-data="{ loaded: false }"
          @load="loaded = true; setTimeout(() => $el.classList.replace('duration-200', 'duration-500'), 200)"
          :class="loaded ? 'opacity-100' : 'opacity-0'"
          src="https://github.com/Carl2121.png"
          alt="Carlos"
          class="absolute inset-0 w-full h-full object-cover transition-all duration-200 hover:scale-125" />
      </div>
      <p class="mt-4 font-medium">Carlos Heredero</p>
    </a>
  </div>
</section>
