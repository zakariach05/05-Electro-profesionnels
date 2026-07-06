<?php

return [
    'validation' => [
        'required' => 'This field is required.',
        'email' => 'This email address is not valid.',
        'min' => [
            'string' => 'This field must be at least :min characters.',
        ],
        'max' => [
            'string' => 'This field may not exceed :max characters.',
        ],
        'unique' => 'This value is already taken.',
        'confirmed' => 'The confirmation does not match.',
    ],
    'auth' => [
        'login_success' => 'Login successful.',
        'login_failed' => 'Invalid credentials.',
        'logout_success' => 'Logged out successfully.',
        'register_success' => 'Account created successfully.',
        'email_verified' => 'Email verified successfully.',
        'invalid_token' => 'Invalid or expired token.',
        'unauthorized' => 'Unauthorized.',
        'forbidden' => 'Access denied.',
        'session_expired' => 'Session expired. Please login again.',
    ],
    'order' => [
        'created' => 'Order created successfully.',
        'updated' => 'Order updated.',
        'cancelled' => 'Order cancelled.',
        'not_found' => 'Order not found.',
        'status_changed' => 'Order status updated.',
    ],
    'product' => [
        'created' => 'Product created successfully.',
        'updated' => 'Product updated.',
        'deleted' => 'Product deleted.',
        'not_found' => 'Product not found.',
        'out_of_stock' => 'This product is out of stock.',
    ],
    'payment' => [
        'success' => 'Payment successful.',
        'failed' => 'Payment failed. Please try again.',
        'pending' => 'Payment pending.',
    ],
    'review' => [
        'created' => 'Review submitted successfully.',
        'deleted' => 'Review deleted.',
        'exists' => 'You have already reviewed this product.',
    ],
    'email' => [
        'order_confirmation_subject' => 'Order Confirmation - Electro-05',
        'order_status_subject' => 'Order Status Update - Electro-05',
        'welcome_subject' => 'Welcome to Electro-05',
        'contact_subject' => 'New Contact Message',
        'reset_password_subject' => 'Reset Your Password',
        'magic_link_subject' => 'Your Magic Login Link',
    ],
    'system' => [
        'error' => 'A server error occurred.',
        'not_found' => 'Resource not found.',
        'success' => 'Operation successful.',
    ],
];
