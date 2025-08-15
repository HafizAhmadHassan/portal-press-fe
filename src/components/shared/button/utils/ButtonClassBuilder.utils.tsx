import type { ButtonSize, ButtonVariant, IconPosition } from '../types/Button.types';

export class ButtonClassBuilder {
    private classes: string[] = ['btn'];

    static create(): ButtonClassBuilder {
        return new ButtonClassBuilder();
    }

    variant(variant: ButtonVariant): this {
        this.classes.push(`btn-${variant}`);
        return this;
    }

    size(size: ButtonSize): this {
        if (size !== 'md') {
            this.classes.push(`btn-${size}`);
        }
        return this;
    }

    block(isBlock: boolean): this {
        if (isBlock) this.classes.push('btn-block');
        return this;
    }

    rounded(isRounded: boolean): this {
        if (isRounded) this.classes.push('btn-rounded');
        return this;
    }

    raised(isRaised: boolean): this {
        if (isRaised) this.classes.push('btn-raised');
        return this;
    }

    square(isSquare: boolean): this {
        if (isSquare) this.classes.push('btn-square');
        return this;
    }

    iconOnly(isIconOnly: boolean): this {
        if (isIconOnly) this.classes.push('btn-icon');
        return this;
    }

    loading(isLoading: boolean): this {
        if (isLoading) this.classes.push('loading');
        return this;
    }

    pulse(hasPulse: boolean): this {
        if (hasPulse) this.classes.push('btn-pulse');
        return this;
    }

    iconPosition(position: IconPosition, hasIcon: boolean, isIconOnly: boolean): this {
        if (hasIcon && !isIconOnly) {
            this.classes.push(`btn-icon-${position}`);
        }
        return this;
    }

    custom(className?: string): this {
        if (className) {
            this.classes.push(className);
        }
        return this;
    }

    build(): string {
        return this.classes.join(' ');
    }
}