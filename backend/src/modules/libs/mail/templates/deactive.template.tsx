/* eslint-disable prettier/prettier */
import * as React from 'react'
import { Body } from '@react-email/body'
import { Button } from '@react-email/button'
import { Container } from '@react-email/container'
import { Head } from '@react-email/head'
import { Heading } from '@react-email/heading'
import { Hr } from '@react-email/hr'
import { Html } from '@react-email/html'
import { Preview } from '@react-email/preview'
import { Section } from '@react-email/section'
import { Text } from '@react-email/text'
import { SessionMetadata } from '@/src/shared/types/session-metadata.types'

interface DeactiveTemplateProps {
	token: string
	metadata: SessionMetadata
}

export function DeactiveTemplate({
	token,
	metadata
}: DeactiveTemplateProps) {

	return (
		<Html>
			<Head />
			<Preview>Your Stream account has been deactivated</Preview>
			<Body style={styles.body}>
				<Container style={styles.container}>
					{/* Logo / Brand */}
					<Section style={styles.logoSection}>
						<Heading style={styles.brand}>🎬 Stream</Heading>
					</Section>

					<Hr style={styles.hr} />

					{/* Main content */}
					<Section style={styles.content}>
						<Heading as='h2' style={styles.heading}>
							Your account has been deactivated
						</Heading>
						<Text style={styles.text}>
							We're sorry to see you go. Your Stream account has been
							successfully deactivated. You will no longer have access to
							your account or its content.
						</Text>
						<Text style={styles.text}>
							If this was a mistake or you'd like to restore your account,
							click the button below within <strong>15 minutes</strong>.
						</Text>

						<Section style={styles.buttonWrapper}>
							<Button style={styles.button}>
								Reactivate My Account
							</Button>
						</Section>

						<Text style={styles.smallText}>
							Or copy and paste this URL into your browser:
						</Text>
						<Text style={styles.link}>{token}</Text>
					</Section>

					<Hr style={styles.hr} />

					{/* Request metadata */}
					<Section style={styles.metaSection}>
						<Text style={styles.metaTitle}>Request details</Text>
						<table style={styles.metaTable}>
							<tbody>
								<tr>
									<td style={styles.metaLabel}>IP Address</td>
									<td style={styles.metaValue}>{metadata.ip}</td>
								</tr>
								<tr>
									<td style={styles.metaLabel}>Location</td>
									<td style={styles.metaValue}>
										{metadata.location.city}, {metadata.location.country}
									</td>
								</tr>
								<tr>
									<td style={styles.metaLabel}>Device</td>
									<td style={styles.metaValue}>
										{metadata.device.browser} · {metadata.device.os} ·{' '}
										{metadata.device.type}
									</td>
								</tr>
							</tbody>
						</table>
					</Section>

					<Hr style={styles.hr} />

					{/* Footer */}
					<Section style={styles.footer}>
						<Text style={styles.footerText}>
							If you did not request this deactivation, please reactivate
							your account immediately and consider changing your password.
						</Text>
						<Text style={styles.footerText}>
							© {new Date().getFullYear()} Stream. All rights reserved.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	)
}

const styles: Record<string, React.CSSProperties> = {
	body: {
		backgroundColor: '#0f0f0f',
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
		margin: 0,
		padding: 0
	},
	container: {
		maxWidth: '560px',
		margin: '40px auto',
		backgroundColor: '#1a1a1a',
		borderRadius: '12px',
		overflow: 'hidden',
		border: '1px solid #2a2a2a'
	},
	logoSection: {
		padding: '32px 40px 20px'
	},
	brand: {
		fontSize: '24px',
		fontWeight: '700',
		color: '#e50914',
		margin: 0
	},
	hr: {
		borderColor: '#2a2a2a',
		margin: 0
	},
	content: {
		padding: '32px 40px'
	},
	heading: {
		fontSize: '22px',
		fontWeight: '700',
		color: '#ffffff',
		margin: '0 0 16px'
	},
	text: {
		fontSize: '15px',
		lineHeight: '1.6',
		color: '#a0a0a0',
		margin: '0 0 16px'
	},
	buttonWrapper: {
		textAlign: 'center' as const,
		margin: '28px 0'
	},
	button: {
		backgroundColor: '#e50914',
		color: '#ffffff',
		fontSize: '15px',
		fontWeight: '600',
		textDecoration: 'none',
		padding: '14px 32px',
		borderRadius: '8px',
		display: 'inline-block'
	},
	smallText: {
		fontSize: '13px',
		color: '#666666',
		margin: '0 0 6px'
	},
	link: {
		fontSize: '13px',
		color: '#e50914',
		wordBreak: 'break-all' as const,
		margin: 0
	},
	metaSection: {
		padding: '24px 40px'
	},
	metaTitle: {
		fontSize: '13px',
		fontWeight: '600',
		color: '#888888',
		margin: '0 0 12px',
		textTransform: 'uppercase' as const,
		letterSpacing: '0.5px'
	},
	metaTable: {
		width: '100%',
		borderCollapse: 'collapse' as const
	},
	metaLabel: {
		fontSize: '13px',
		color: '#666666',
		padding: '4px 12px 4px 0',
		whiteSpace: 'nowrap' as const,
		width: '110px'
	},
	metaValue: {
		fontSize: '13px',
		color: '#a0a0a0',
		padding: '4px 0'
	},
	footer: {
		padding: '24px 40px 32px'
	},
	footerText: {
		fontSize: '12px',
		color: '#555555',
		margin: '0 0 6px',
		lineHeight: '1.5'
	}
}
