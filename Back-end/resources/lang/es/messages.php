<?php

return [
    'validation' => [
        'required' => 'Este campo es obligatorio.',
        'email' => 'Este correo electrónico no es válido.',
        'min' => ['string' => 'Este campo debe tener al menos :min caracteres.'],
        'max' => ['string' => 'Este campo no puede superar :max caracteres.'],
        'unique' => 'Este valor ya está en uso.',
        'confirmed' => 'La confirmación no coincide.',
    ],
    'auth' => [
        'login_success' => 'Inicio de sesión exitoso.',
        'login_failed' => 'Credenciales incorrectas.',
        'logout_success' => 'Sesión cerrada con éxito.',
        'register_success' => 'Cuenta creada con éxito.',
        'email_verified' => 'Correo verificado con éxito.',
        'invalid_token' => 'Token inválido o expirado.',
        'unauthorized' => 'No autorizado.',
        'forbidden' => 'Acceso denegado.',
        'session_expired' => 'Sesión expirada. Inicia sesión de nuevo.',
    ],
    'order' => [
        'created' => 'Pedido creado con éxito.',
        'updated' => 'Pedido actualizado.',
        'cancelled' => 'Pedido cancelado.',
        'not_found' => 'Pedido no encontrado.',
        'status_changed' => 'Estado del pedido actualizado.',
    ],
    'product' => [
        'created' => 'Producto creado con éxito.',
        'updated' => 'Producto actualizado.',
        'deleted' => 'Producto eliminado.',
        'not_found' => 'Producto no encontrado.',
        'out_of_stock' => 'Este producto no está disponible.',
    ],
    'payment' => [
        'success' => 'Pago realizado con éxito.',
        'failed' => 'El pago ha fallado. Intenta de nuevo.',
        'pending' => 'Pago pendiente.',
    ],
    'review' => [
        'created' => 'Opinión añadida con éxito.',
        'deleted' => 'Opinión eliminada.',
        'exists' => 'Ya has opinado sobre este producto.',
    ],
    'email' => [
        'order_confirmation_subject' => 'Confirmación de pedido - Electro-05',
        'order_status_subject' => 'Actualización de tu pedido - Electro-05',
        'welcome_subject' => 'Bienvenido a Electro-05',
        'contact_subject' => 'Nuevo mensaje de contacto',
        'reset_password_subject' => 'Restablecer tu contraseña',
        'magic_link_subject' => 'Tu enlace de acceso mágico',
    ],
    'system' => [
        'error' => 'Ocurrió un error del servidor.',
        'not_found' => 'Recurso no encontrado.',
        'success' => 'Operación exitosa.',
    ],
];
