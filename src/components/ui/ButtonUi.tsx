import React, { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react';
import type {LucideIcon} from 'lucide-react';

// Types pour les variantes et tailles
type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'success'
    | 'glass'; // Effet glassmorphism

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

// Interface pour les props du bouton
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
    // Contenu
    children?: ReactNode;

    // Icônes
    icon?: LucideIcon; // Icône React Lucide
    customIcon?: ReactNode; // SVG ou autre icône personnalisée
    iconPosition?: 'left' | 'right';
    iconOnly?: boolean; // Bouton avec seulement une icône

    // Apparence
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    rounded?: boolean; // Bouton complètement arrondi

    // États
    state?: ButtonState;
    loading?: boolean; // Raccourci pour state="loading"

    // Animations
    animate?: boolean; // Active les animations au hover
    pulseOnClick?: boolean; // Animation de pulse au clic

    // Accessibilité
    tooltip?: string;

    // Classes personnalisées
    className?: string;
    iconClassName?: string;
}

// Styles pour les variantes
const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600',
    outline: 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border-transparent',
    destructive: 'bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 shadow-sm hover:shadow-md',
    success: 'bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 shadow-sm hover:shadow-md',
    glass: 'bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 border-white/40 dark:border-slate-700/40 backdrop-blur-sm shadow-sm hover:shadow-md'
};

// Styles pour les tailles
const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
};

// Styles pour les icônes selon la taille
const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-7 w-7'
};

// Styles pour les états de chargement
const stateStyles = {
    idle: '',
    loading: 'cursor-wait opacity-80',
    success: 'bg-green-600 dark:bg-green-600 text-white border-green-600',
    error: 'bg-red-600 dark:bg-red-600 text-white border-red-600'
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
                                                               children,
                                                               icon: Icon,
                                                               customIcon,
                                                               iconPosition = 'left',
                                                               iconOnly = false,
                                                               variant = 'secondary',
                                                               size = 'md',
                                                               fullWidth = false,
                                                               rounded = false,
                                                               state = 'idle',
                                                               loading = false,
                                                               animate = true,
                                                               pulseOnClick = false,
                                                               tooltip,
                                                               className = '',
                                                               iconClassName = '',
                                                               disabled,
                                                               onClick,
                                                               ...props
                                                           }, ref) => {
    // Détermine l'état final
    const finalState = loading ? 'loading' : state;
    const isDisabled = disabled || finalState === 'loading';

    // Classes de base
    const baseClasses = [
        'inline-flex items-center justify-center font-medium',
        'border transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none',
        rounded ? 'rounded-full' : 'rounded-lg',
        fullWidth ? 'w-full' : '',
        animate ? 'transform hover:scale-105 active:scale-95' : '',
        pulseOnClick ? 'active:animate-pulse' : '',
        sizeStyles[size],
        finalState !== 'idle' ? stateStyles[finalState] : variantStyles[variant],
        className
    ].filter(Boolean).join(' ');

    // Icône à afficher
    const renderIcon = () => {
        if (finalState === 'loading') {
            return (
                <div className={`animate-spin border-2 border-current border-t-transparent rounded-full ${iconSizes[size]}`} />
            );
        }

        if (Icon) {
            return <Icon className={`${iconSizes[size]} ${iconClassName}`} />;
        }

        if (customIcon) {
            return (
                <span className={`${iconSizes[size]} ${iconClassName} flex items-center justify-center`}>
          {customIcon}
        </span>
            );
        }

        return null;
    };

    // Gestion du clic
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) return;
        onClick?.(e);
    };

    // Contenu du bouton
    const buttonContent = () => {
        const iconElement = renderIcon();

        if (iconOnly) {
            return iconElement;
        }

        if (!iconElement) {
            return children;
        }

        return iconPosition === 'left' ? (
            <>
                {iconElement}
                {children && <span className="ml-2">{children}</span>}
            </>
        ) : (
            <>
                {children && <span className="mr-2">{children}</span>}
                {iconElement}
            </>
        );
    };

    return (
        <button
            ref={ref}
            className={baseClasses}
            disabled={isDisabled}
            onClick={handleClick}
            title={tooltip}
            aria-label={tooltip || (typeof children === 'string' ? children : undefined)}
            {...props}
        >
            {buttonContent()}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;

// Exemples d'utilisation en bas du fichier pour référence
/*
// Exemples d'utilisation :

import { Download, Plus, Save, Trash2 } from 'lucide-react';
import Button from './Button';

// Bouton basique
<Button>Cliquez-moi</Button>

// Avec icône Lucide
<Button icon={Download} variant="primary">
  Télécharger
</Button>

// Avec SVG personnalisé
<Button
  customIcon={<svg>...</svg>}
  variant="outline"
  iconPosition="right"
>
  Action
</Button>

// Icône seulement
<Button icon={Plus} iconOnly variant="ghost" tooltip="Ajouter" />

// État de chargement
<Button icon={Save} loading>
  Sauvegarde...
</Button>

// États personnalisés
<Button state="success" icon={Save}>
  Sauvegardé !
</Button>

// Bouton destructif
<Button icon={Trash2} variant="destructive">
  Supprimer
</Button>

// Effet glass
<Button variant="glass" icon={Download}>
  Export
</Button>

// Bouton pleine largeur
<Button fullWidth variant="primary">
  Valider
</Button>

// Bouton arrondi avec animations
<Button
  rounded
  animate
  pulseOnClick
  icon={Plus}
  iconOnly
  variant="primary"
  tooltip="Ajouter un élément"
/>
*/