# 💧 Manual Explicativo y Guía de Defensa Oral — AquaControl (Escalera Raquel)

Este manual está diseñado especialmente para que comprendas **qué hace la aplicación**, **cómo se construyó** y **qué responder si el profesor te hace preguntas** durante tu exposición. No necesitas memorizar código complicado: lo importante es entender la idea de cada herramienta y cómo trabajan juntas.

---

## 1. ¿Cuál es el problema que resuelve la app?

En la comunidad **Escalera Raquel**, el agua llega por ciclos de bombeo y las familias tienen que esperar varios días entre un bombeo y otro. Calcular a mano cuántos litros diarios se pueden gastar según la cantidad de personas, tanques, potes y días de espera es difícil.

**AquaControl** funciona como el **“cerebro logístico”** del hogar:
1. La familia ingresa su **Sector**, **Nombre de familia**, **Integrantes**, **Tanques/Potes** y **Días de espera**.
2. La app calcula automáticamente:
   - **Ración diaria disponible (L/día):** cuánta agua pueden usar por día sin quedarse en cero antes del próximo bombeo.
   - **Días de reserva:** cuántos días duraría el agua si se gastara a ritmo normal (50 litros por persona al día).
   - **Recomendación de uso:** qué actividades priorizar (Cocina, Baño, Limpieza).
   - **Alerta de déficit (Verde, Amarillo o Rojo):** un semáforo visual que avisa si hay peligro de quedarse sin agua.

---

## 2. ¿Qué lenguajes y herramientas se usaron? (Explicado fácil)

Imagina que construir una aplicación web es como construir una **casa**:

### 🐍 Python (con FastAPI) — *El cerebro y las matemáticas (Backend)*
- **¿Qué es?** Python es un lenguaje de programación muy famoso, claro y fácil de leer. Se usa en ciencia, inteligencia artificial y servidores web.
- **¿Para qué se usó aquí?** Para hacer los **cálculos matemáticos** del racionamiento (`backend/calculator.py`) y crear un servidor web rápido con **FastAPI** (`backend/main.py`) que recibe los datos de la familia y devuelve los resultados exactos.
- **¿Cómo explicarlo al profesor?** *"Python se encarga de la lógica y las fórmulas matemáticas en el servidor, validando que los números tengan sentido (por ejemplo, que no haya 0 integrantes)."*

### ⚛️ React (con Vite) — *La cara visible e interactiva (Frontend)*
- **¿Qué es?** React es una herramienta creada por Meta (Facebook) para construir pantallas web modernas e interactivas usando **JavaScript**.
- **¿Para qué se usó aquí?** Para crear los formularios, botones, deslizadores, tarjetas de resultados y el historial sin que la página tenga que recargarse cada vez que haces clic.
- **¿Cómo explicarlo al profesor?** *"React construye la interfaz que ve el usuario en la pantalla y actualiza los resultados al instante cuando presionamos Calcular."*

### 🎨 Material UI (MUI) — *El diseño profesional y adaptable*
- **¿Qué es?** Es una librería de diseño creada por Google (Material Design) lista para usar en React.
- **¿Para qué se usó aquí?** Nos dio los botones, campos de texto, íconos de gotas y alertas con un aspecto **100% profesional y responsive** (se adapta sola tanto a la pantalla de un teléfono como a la de una computadora), además de permitir cambiar entre **modo claro y modo oscuro**.
- **¿Cómo explicarlo al profesor?** *"Material UI nos permitió lograr un diseño limpio, moderno y fácil de usar para cualquier vecino de la comunidad, siguiendo los estándares visuales de Google."*

### 📱 PWA (Progressive Web App) — *Instalable en el teléfono*
- **¿Qué es?** Una **Aplicación Web Progresiva** es una página web especial que puede **instalarse en el celular** como si fuera una app de Play Store o App Store, y además **funciona sin internet**.
- **¿Para qué se usó aquí?** Para que cualquier vecino de Escalera Raquel pueda guardarla en la pantalla de inicio de su teléfono y usar la calculadora incluso si se va la señal o no tiene datos móviles (gracias al respaldo local en `rationingFallback.js`).
- **¿Cómo explicarlo al profesor?** *"La hicimos PWA para que no dependa de tiendas de aplicaciones ni ocupe mucho espacio; se instala directo desde el navegador y sigue calculando aunque no haya internet."*

### 🌐 HTML, CSS y JavaScript — *La base de toda web*
- **HTML** (`index.html`): es el esqueleto donde vive la aplicación.
- **CSS / Estilos**: le da los colores azules de agua, bordes redondeados y tamaños.
- **JavaScript**: es el idioma del navegador que hace que los botones respondan y se comuniquen con Python.

---

## 3. ¿Cómo se realizó paso a paso?

1. **Análisis del problema:** Se revisó la documentación comunitaria de Escalera Raquel y el boceto en video para definir los datos de entrada (Sector, Familia, Integrantes, Potes/Tanques, Días de espera) y las 4 salidas principales.
2. **Creación del motor matemático en Python (`backend/`):** Se programaron las fórmulas de división de litros totales entre días de espera y personas, y las reglas del semáforo de alerta (Rojo < 20 L/persona/día, Amarillo 20–49 L, Verde ≥ 50 L).
3. **Diseño de la interfaz en React + Material UI (`frontend/`):** Se dividió la pantalla en componentes ordenados (`HeaderBar`, `HouseholdForm`, `ResultsDashboard`, `UsageDistribution`, `HistoryPanel`) para que sea clara en celulares.
4. **Conversión a PWA:** Se agregaron los íconos, el archivo `manifest.webmanifest` y el *Service Worker* para que pueda instalarse en móviles y funcionar sin conexión.
5. **Pruebas:** Se ejecutaron pruebas automáticas en Python (`pytest`) y la compilación final de React (`vite build`) para verificar que todo funcione sin errores.

---

## 4. ¿Cómo ejecutar la app para mostrarla en clase?

1. Haz doble clic en el archivo **`iniciar_app.bat`** dentro de la carpeta del proyecto.
2. Abre Google Chrome o Edge y entra a: **`http://localhost:8000`**
3. Para mostrar cómo se ve en un teléfono desde la computadora: presiona **`F12`** en Chrome y haz clic en el ícono de celular/tablet arriba a la izquierda (*Toggle device toolbar*).
4. Para instalarla en el teléfono real (si están en la misma red Wi-Fi): abre la dirección IP de la laptop con `:8000` en el celular y toca **"Instalar App"**.

---

## 5. Preguntas frecuentes para tu defensa oral ante el profesor

**1. ¿Por qué usaron Python y React en lugar de hacer todo en Excel o en una página simple?**
> *Respuesta:* Porque Excel requiere que cada vecino sepa usar fórmulas y no es cómodo en un celular. Al usar React con Material UI logramos una pantalla muy fácil de tocar en el teléfono, y con Python tenemos un servidor ordenado que hace los cálculos exactos y puede crecer en el futuro (por ejemplo, para guardar datos de toda la comunidad).

**2. ¿De dónde salen los números del semáforo (20 litros y 50 litros por persona)?**
> *Respuesta:* Son referencias estándar internacionales (como la OMS): **20 litros por persona al día** es el mínimo vital para beber, cocinar e higiene básica; menos de eso es **alerta roja**. **50 litros por persona al día** cubre necesidades básicas completas sin estrés; por encima de eso está en **verde**.

**3. ¿Qué pasa si un vecino no tiene internet en su casa?**
> *Respuesta:* Como la app es una **PWA**, guarda sus archivos en el teléfono y tiene un respaldo local que ejecuta exactamente la misma fórmula matemática sin necesidad de internet. Cuando vuelve la conexión, se conecta de nuevo con Python.

**4. ¿Qué significa que sea "responsive"?**
> *Respuesta:* Significa que la página se acomoda automáticamente al tamaño de cualquier pantalla: en una computadora los cuadros se ven uno al lado del otro, y en un celular se apilan uno debajo del otro para que no haya que hacer zoom ni mover la pantalla hacia los lados.

**5. ¿Cuál es el mayor beneficio para la comunidad Escalera Raquel?**
> *Respuesta:* Que transforma la teoría del racionamiento en una herramienta práctica del día a día: cualquier familia sabe exactamente cuántos litros puede gastar hoy para no quedarse sin agua antes del próximo ciclo de bombeo.

